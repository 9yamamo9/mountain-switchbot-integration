import 'reflect-metadata'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import Nature from './entity/nature'
import { NATURE_APPLIANCE_NICKNAME } from './constant/nature/nature'
import { container } from 'tsyringe'
import NatureRemoteControl from './repository/control/nature'
import { BaseErrorWithServiceCode } from 'base-error'
import { messageResponse, messageResponseWithServiceCode } from 'base-response'

container.register('IRemoteControl', {
	useClass: NatureRemoteControl
})

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const body = event.body
	const decodedBody = decodeURI(body)
	console.log('decodedBody: ', decodedBody)

	const nature = new Nature(NATURE_APPLIANCE_NICKNAME)

	try {
		await nature.turnOff()
	} catch (e) {
		if (e instanceof BaseErrorWithServiceCode) {
			return messageResponseWithServiceCode(
				e.statusCode,
				e.serviceCode,
				'Faiqled to turn off an air conditioning'
			)
		} else {
			return messageResponse(500, 'Unknown Error')
		}
	}

	return messageResponse(201, 'Turn off an air conditioning')
}