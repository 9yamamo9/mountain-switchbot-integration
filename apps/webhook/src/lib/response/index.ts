import { APIGatewayProxyResult } from 'aws-lambda'

export const messageResponse = (statusCode: number, message: string): APIGatewayProxyResult => {
	return {
		statusCode: statusCode,
		body: JSON.stringify({ message: message })
	}
}

export const messageResponseWithServiceCode = (statusCode: number, serviceCode: number, message: string): APIGatewayProxyResult => {
	return {
		statusCode: statusCode,
		body: JSON.stringify({
			message: message,
			serviceCode: serviceCode
		})
	}
}