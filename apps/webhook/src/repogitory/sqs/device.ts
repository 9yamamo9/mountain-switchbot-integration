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

	public delete = async (messageId: string): Promise<void> => {
		try {
			const receiveCommand = new ReceiveMessageCommand({
				QueueUrl: DEVICE_QUEUE_URL
			})
			const receiveCommandResponse = await this.client.send(receiveCommand)

			const targetMessage = receiveCommandResponse.Messages.filter((message) => message.MessageId === messageId).at(0)

			const deleteMessageCommand = new DeleteMessageCommand({
				QueueUrl: DEVICE_QUEUE_URL,
				ReceiptHandle: targetMessage.ReceiptHandle
			})
			await this.client.send(deleteMessageCommand)
		} catch (e) {
			throw e
		}
	}

	public isExist = async (messageId: string): Promise<boolean> => {
		try {
			let hasTargetMessage = false

			const command = new ReceiveMessageCommand({
				QueueUrl: DEVICE_QUEUE_URL
			})
			const response = await this.client.send(command)

			response.Messages.forEach((message) => {
				if (message.MessageId === messageId) hasTargetMessage = true
			})

			return hasTargetMessage
		} catch (e) {
			throw e
		}
	}
}