export const DeviceStatusMap = {
	Detect: 'DETECTED',
	NotDetect: 'NOT_DETECTED'
} as const
export type DeviceStatus = typeof DeviceStatusMap[keyof typeof DeviceStatusMap]