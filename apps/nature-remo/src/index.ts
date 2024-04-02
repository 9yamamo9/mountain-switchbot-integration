import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const body = event.body
	const decodedBody = decodeURI(body)
	console.log('decodedBody: ', decodedBody)

	return {
		statusCode: 201,
		body: JSON.stringify({ message: 'Hello World!' })
	}
}