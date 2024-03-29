export interface DeviceItem {
	id: string
	status: DeviceStatus
	battery: number
	messageId: string
}

export const DeviceStatusMap = {
	Detect: 'DETECTED',
	NotDetect: 'NOT_DETECTED'
} as const
type DeviceStatus = typeof DeviceStatusMap[keyof typeof DeviceStatusMap]
