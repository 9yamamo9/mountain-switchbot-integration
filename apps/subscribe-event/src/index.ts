import 'reflect-metadata'
import { SQSEvent } from 'aws-lambda'
import { container } from 'tsyringe'
import DeviceDynamoDB from './repository/dyanamodb/device'
import Slack from './repository/caht/slack'
import DeviceEvent from './entity/event/event'

container.register('IDeviceDatabase', {
	useClass: DeviceDynamoDB
})

container.register('IChat', {
	useClass: Slack
})

export const handler = async (event: SQSEvent)=> {
	console.log('event: ', JSON.stringify(event))

	const records = event.Records

	for (const record of records) {
		const messageId = record.messageId
		const body = JSON.parse(record.body) // FIXME: cast Type

		const event = new DeviceEvent(messageId, body.Id, body.Status, body.Battery)

		await event.notify()
	}
}