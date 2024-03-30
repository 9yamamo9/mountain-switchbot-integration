import Device from './device'
import { DeviceItem } from '../../type/database/dynamodb/device'

export interface IDeviceDatabase {
	getItem: (deviceId: string) => Promise<DeviceItem | undefined>
	register: (device: Device, messageId: string) => Promise<void>
}