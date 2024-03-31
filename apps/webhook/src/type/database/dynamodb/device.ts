import { DeviceStatus } from '../../switchbot/device'

export interface DeviceItem {
	Id: string
	Status: DeviceStatus
	Battery: number
	MessageId: string
}
