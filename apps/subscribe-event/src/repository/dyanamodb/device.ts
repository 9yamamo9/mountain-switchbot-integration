import { IDeviceDatabase } from '../../entity/event/deviceDatabaseInterface'
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DeviceItem } from '../../type/database/dynamodb/device'
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

		console.log('item: ', response.Item)

		return response.Item as DeviceItem
	}
}