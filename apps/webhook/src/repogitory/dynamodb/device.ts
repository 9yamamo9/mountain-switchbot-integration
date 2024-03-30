import { IDeviceDatabase } from '../../entity/switchbot/deviceDatabaseInterface'
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DeviceItem } from '../../type/database/dynamodb/device'
import Device from '../../entity/switchbot/device'
import { SWITCHBOT_DEVICE } from '../../constant/database/dynamodb'

export default class DeviceDynamoDB implements IDeviceDatabase {
	private readonly client: DynamoDBDocumentClient

	constructor() {
		this.client = DynamoDBDocumentClient.from(new DynamoDBClient({}))
	}

	public getItem = async (deviceId: string): Promise<DeviceItem> => {
		const command = new GetCommand({
			TableName: `${SWITCHBOT_DEVICE}`,
			Key: {
				Id: deviceId
			}
		})

		const response = await this.client.send(command)

		return response.Item as DeviceItem
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

		await this.client.send(command)
	}
}