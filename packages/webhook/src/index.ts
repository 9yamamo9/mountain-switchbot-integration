import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Event } from './type/switchbot/event'
import { Device } from './entity/switchbot/device'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const body = JSON.parse(event.body) as Event
	const device = new Device(body.context.deviceMac, body.context.detectionState, body.context.battery)

	return {
		statusCode: 200,
		body: JSON.stringify({ message: 'Hello World' })
	}
}