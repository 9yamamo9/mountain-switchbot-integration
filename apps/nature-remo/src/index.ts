import 'reflect-metadata'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import Nature from './entity/nature'
import { container } from 'tsyringe'
import NatureRemoteControl from './repository/control/nature'
import { BaseErrorWithServiceCode, RepositoryCallErrorWithServiceCode } from 'base-error'
import { messageResponse, messageResponseWithServiceCode } from 'base-response'
import { SlackWebhookRequest } from './type/slack/webhook'
import Slack from './repository/chat/slack'

container.register('IRemoteControl', {
	useClass: NatureRemoteControl
})

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const body = event.body
	if (!body) {
		console.error(`event.body is null`)

		return messageResponse(500, 'Request payload is unexpected')
	}

	const decodedBody = JSON.parse(decodeURIComponent(decodeURI(body).replace('payload=', ''))) as SlackWebhookRequest
	console.log('decodedBody: ', JSON.stringify(decodedBody))

	const responseUrl = decodedBody.response_url
	const targetApplianceNicknames = decodedBody.actions
		.map((action) => {
			if (action.value.includes('turn_off')) {
				return action.value.replace('turn_off_', '')
			}
		})
		.filter((nickname) => nickname !== undefined)

	container.register('IChat', {
		useValue: new Slack(responseUrl)
	})

	for (const nickname of targetApplianceNicknames) {
		if (!nickname) continue
		const nature = new Nature(nickname)

		try {
			await nature.turnOff()
		} catch (e) {
			if (e instanceof BaseErrorWithServiceCode) {
				return messageResponseWithServiceCode(
					e.statusCode,
					e.serviceCode,
					'Failed to turn off an air conditioning'
				)

			} else if (e instanceof RepositoryCallErrorWithServiceCode) {
				return messageResponseWithServiceCode(
					e.statusCode,
					e.serviceCode,
					`Failed to call repository resource: ${e.message}`
				)

			} else {
				return messageResponse(500, 'Unknown Error')
			}
		}
	}


	return messageResponse(201, 'Turn off an air conditioning')
}