import { IDeviceQueue } from '../../entity/switchbot/deviceQueueInterface'
import { DeleteMessageCommand, ReceiveMessageCommand, SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
import Device from '../../entity/switchbot/device'
import { DEVICE_QUEUE_URL } from '../../constant/queue/sqs'

export default class DeviceQueue implements IDeviceQueue {
	private readonly client: SQSClient

	constructor() {
		this.client = new SQSClient()
	}

	public send = async (device: Device): Promise<string> => {
		try {
			const command = new SendMessageCommand({
				QueueUrl: DEVICE_QUEUE_URL,
				MessageBody: JSON.stringify(device)
			})

			const response = await this.client.send(command)

			return response.MessageId
		} catch (e) {
			throw e
		}
	}
}