import 'reflect-metadata'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Event } from './type/switchbot/event'
import Device from './entity/switchbot/device'
import { container } from 'tsyringe'
import DeviceDynamoDB from './repogitory/dynamodb/device'
import DeviceQueue from './repogitory/sqs/device'
import { BaseErrorWithServiceCode } from './lib/error'
import { messageResponse, messageResponseWithServiceCode } from './lib/response'

container.register('IDeviceDatabase', {
	useClass: DeviceDynamoDB
})

container.register('IDeviceQueue', {
	useClass: DeviceQueue
})

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const body = JSON.parse(event.body) as Event

	const device = new Device(body.context.deviceMac, body.context.detectionState, body.context.battery)

	try {
		await device.notify()
	} catch (e) {
		if (e instanceof BaseErrorWithServiceCode) {
			console.error(
				`Failed to notify a switchbot device event: ${e.message}, name: ${e.name}, service code: ${e.serviceCode}`
			)

			return messageResponseWithServiceCode(
				e.statusCode,
				e.serviceCode,
				'Filed to receive the switchbot device event'
			)
		}

		console.error(e)
		return messageResponse(500, 'Unknown Error')
	}

	return messageResponse(201, 'Receive the switchbot device event')
}