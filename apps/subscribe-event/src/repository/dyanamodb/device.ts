import { IDeviceDatabase } from '../../entity/event/deviceDatabaseInterface'
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DeviceItem } from '../../type/database/dynamodb/device'
import { SWITCHBOT_DEVICE } from '../../constant/database/dynamodb'
import { GetItemError } from '../../lib/error/database'

export default class DeviceDynamoDB implements IDeviceDatabase {
	private readonly client: DynamoDBDocumentClient

	constructor() {
		this.client = DynamoDBDocumentClient.from(new DynamoDBClient({}))
	}

	public getItem = async (deviceId: string): Promise<DeviceItem> => {
		let deviceItem: DeviceItem

		const command = new GetCommand({
			TableName: `${SWITCHBOT_DEVICE}`,
			Key: { Id: deviceId }
		})

		try {
			const response = await this.client.send(command)
			deviceItem = response.Item as DeviceItem
		} catch (e) {
			if (e instanceof Error) {
				console.error(
					`Failed to get a item from ${SWITCHBOT_DEVICE}: ${e.message}, deviceId: ${deviceId}, stack: ${e.stack}`
				)

				throw new GetItemError(500, `Failed to get a item from ${SWITCHBOT_DEVICE}`)
			}

			throw new GetItemError(
				500,
				`Failed to get a item by unknown error: ${e}`
			)
		}

		return deviceItem
	}
}