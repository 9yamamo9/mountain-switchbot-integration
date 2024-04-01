import { DeviceStatus } from '../../device/device'

export interface DeviceItem {
	Id: string
	Status: DeviceStatus
	Battery: number
	MessageId: string
}
