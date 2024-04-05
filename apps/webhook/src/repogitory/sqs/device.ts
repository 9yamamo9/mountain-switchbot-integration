import { IDeviceQueue } from '../../entity/switchbot/deviceQueueInterface'
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
import Device from '../../entity/switchbot/device'
import { DEVICE_QUEUE_URL } from '../../constant/queue/sqs'
import { DeviceMessage } from '../../type/queue/sqs/device'
import { SendMessageError } from '../../lib/error/queue'

export default class DeviceQueue implements IDeviceQueue {
	private readonly client: SQSClient

	constructor() {
		this.client = new SQSClient()
	}

	public send = async (device: Device): Promise<string> => {
		let messageId = 'nothing'

		const messageBody: DeviceMessage = { Id: device.id, Status: device.status, Battery: device.battery }
		const command = new SendMessageCommand({
			QueueUrl: DEVICE_QUEUE_URL,
			MessageBody: JSON.stringify(messageBody)
		})

		try {
			const response = await this.client.send(command)
			messageId = response.MessageId || 'nothing'
		} catch (e) {
			if (e instanceof Error) {
				console.error(
					`Failed to send a message to ${DEVICE_QUEUE_URL}: ${e.message},
					deviceId: ${device.id}, deviceStatus: ${device.status},
					stack: ${e.stack}`
				)
				throw new SendMessageError(500, 'Failed to send a message to a queue')
			}
		}

		return messageId
	}
}