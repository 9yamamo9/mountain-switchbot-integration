export const NotifyStatusMap = {
	NotNeed: 'NotNeed',
	NotNeedWithTurningOn: 'NotNeedWithTurningOn',
	Need: 'Need',
} as const
export type NotifyStatus = typeof NotifyStatusMap[keyof typeof NotifyStatusMap]