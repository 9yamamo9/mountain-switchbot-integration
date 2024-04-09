import 'reflect-metadata'
import { SQSEvent } from 'aws-lambda'
import { container } from 'tsyringe'
import DeviceDynamoDB from './repository/dyanamodb/device'
import Slack from './repository/caht/slack'
import DeviceEvent from './entity/event/event'
import { NotifyError } from './lib/error/event'
import { RepositoryCallErrorWithServiceCode } from 'base-error'
import { NATURE_APPLIANCE_NICKNAME } from './constant/nature/nature'
import NatureRemoteControl from './repository/remoteControl/nature'

container.register('IDeviceDatabase', {
	useClass: DeviceDynamoDB
})

container.register('IChat', {
	useClass: Slack
})

container.register('IRemoteControl', {
	useClass: NatureRemoteControl
})

export const handler = async (event: SQSEvent) => {
	console.log('event: ', JSON.stringify(event))

	const records = event.Records

	for (const record of records) {
		const messageId = record.messageId
		const body = JSON.parse(record.body) // FIXME: cast Type

		const event = new DeviceEvent(messageId, body.Id, body.Status, body.Battery, NATURE_APPLIANCE_NICKNAME)

		try {
			await event.notify()
		} catch (e) {
			if (e instanceof NotifyError) {
				console.error(`Failed to notify a message that the status of ${event.deviceId} is detected, service code: ${e.serviceCode}`)
			} else if (e instanceof RepositoryCallErrorWithServiceCode) {
				console.error(`Failed to call repository resource: ${e.message}`)
			}
		}
	}
}