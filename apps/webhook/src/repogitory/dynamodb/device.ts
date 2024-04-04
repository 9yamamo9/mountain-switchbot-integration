import { IDeviceDatabase } from '../../entity/switchbot/deviceDatabaseInterface'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import Device from '../../entity/switchbot/device'
import { SWITCHBOT_DEVICE } from '../../constant/database/dynamodb'
import { DeviceDynamoDBError } from './error'

export default class DeviceDynamoDB implements IDeviceDatabase {
	private readonly client: DynamoDBDocumentClient

	constructor() {
		this.client = DynamoDBDocumentClient.from(new DynamoDBClient({}))
	}

	public register = async (device: Device, messageId: string): Promise<void> => {
		const command = new PutCommand({
			TableName: `${SWITCHBOT_DEVICE}`,
			Item: {
				Id: device.id,
				Status: device.status,
				Battery: device.battery,
				MessageId: messageId
			}
		})

		try {
			await this.client.send(command)
		} catch (e) {
			if (e instanceof Error) {
				console.error(
					`Filed to put a item to ${SWITCHBOT_DEVICE}: ${e.message},
					 deviceId: ${device.id} deviceStatus: ${device.status} messageId: ${messageId}`
				)
				throw new DeviceDynamoDBError(500, 'Failed to register a record to a database')
			}
		}
	}
}