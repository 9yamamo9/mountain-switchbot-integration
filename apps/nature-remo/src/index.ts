import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import Nature from './entity/nature'
import { NATURE_APPLIANCE_NICKNAME } from './constant/nature/nature'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const body = event.body
	const decodedBody = decodeURI(body)
	console.log('decodedBody: ', decodedBody)

	const nature = new Nature(NATURE_APPLIANCE_NICKNAME)

	await nature.turnOff()

	return {
		statusCode: 201,
		body: JSON.stringify({ message: 'Hello World!' })
	}
}