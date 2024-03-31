import Device from './device'
import { DeviceItem } from '../../type/database/dynamodb/device'

export interface IDeviceDatabase {
	register: (device: Device, messageId: string) => Promise<void>
}