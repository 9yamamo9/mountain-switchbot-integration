import 'reflect-metadata'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import Nature from './entity/nature'
import { NATURE_APPLIANCE_NICKNAME } from './constant/nature/nature'
import { container } from 'tsyringe'
import NatureRemoteControl from './repository/control/nature'
import { BaseErrorWithServiceCode, RepositoryCallErrorWithServiceCode } from 'base-error'
import { messageResponse, messageResponseWithServiceCode } from 'base-response'
import { SlackWebhookRequest } from './type/slack/webhook'

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

	const nature = new Nature(NATURE_APPLIANCE_NICKNAME)

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

	return messageResponse(201, 'Turn off an air conditioning')
}