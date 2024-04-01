import { DeviceItem } from '../../type/database/dynamodb/device'

export interface IDeviceDatabase {
	getItem: (deviceId: string) => Promise<DeviceItem>
}