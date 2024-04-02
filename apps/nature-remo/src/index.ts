import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	console.log('event: ', event)

	return {
		statusCode: 201,
		body: JSON.stringify({ message: 'Hello World!' })
	}
}