export interface DeviceItem {
	Id: string
	Status: DeviceStatus
	Battery: number
	MessageId: string
}

export const DeviceStatusMap = {
	Detect: 'DETECTED',
	NotDetect: 'NOT_DETECTED'
} as const
type DeviceStatus = typeof DeviceStatusMap[keyof typeof DeviceStatusMap]
