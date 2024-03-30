import 'reflect-metadata'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Event } from './type/switchbot/event'
import Device from './entity/switchbot/device'
import { container } from 'tsyringe'
import DeviceDynamoDB from './repogitory/dynamodb/device'
import DeviceQueue from './repogitory/sqs/device'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const body = JSON.parse(event.body) as Event

	container.register('IDeviceDatabase', {
		useClass: DeviceDynamoDB
	})

	container.register('IDeviceQueue', {
		useClass: DeviceQueue
	})

	const device = new Device(body.context.deviceMac, body.context.detectionState, body.context.battery)

	await device.notify()

	return {
		statusCode: 200,
		body: JSON.stringify({ message: 'Hello World' })
	}
}