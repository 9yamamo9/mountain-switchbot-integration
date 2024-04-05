import 'reflect-metadata'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Event } from './type/switchbot/event'
import Device from './entity/switchbot/device'
import { container } from 'tsyringe'
import DeviceDynamoDB from './repogitory/dynamodb/device'
import DeviceQueue from './repogitory/sqs/device'
import { NotifyError } from './lib/error/device'
import { messageResponse, messageResponseWithServiceCode } from 'base-response'
import { RepositoryCallErrorWithServiceCode } from './lib/error/base'

container.register('IDeviceDatabase', {
	useClass: DeviceDynamoDB
})

container.register('IDeviceQueue', {
	useClass: DeviceQueue
})

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	if (!event.body) {
		console.error(`event.body is null`)

		return messageResponse(500, 'Request payload is unexpected')
	}


	const deviceEvent = JSON.parse(event.body) as Event

	const device = new Device(deviceEvent.context.deviceMac, deviceEvent.context.detectionState, deviceEvent.context.battery)

	try {
		await device.notify()
	} catch (e) {
		if (e instanceof NotifyError) {
			console.error(
				`Failed to notify a switchbot device event: ${e.message}, name: ${e.name}, service code: ${e.serviceCode}`
			)

			return messageResponseWithServiceCode(
				e.statusCode,
				e.serviceCode,
				'Filed to receive the switchbot device event'
			)
		} else if (e instanceof RepositoryCallErrorWithServiceCode) {
			console.error(`Failed to call repository resource: ${e.message}`)

			return messageResponseWithServiceCode(
				e.statusCode,
				e.serviceCode,
				'Failed to call some resource'
			)
		}

		console.error(e)
		return messageResponse(500, 'Unknown Error')
	}

	return messageResponse(201, 'Receive the switchbot device event')
}