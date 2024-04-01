export const NotifyStatusMap = {
	NotNeed: 'NotNeed',
	Need: 'Need'
} as const
export type NotifyStatus = typeof NotifyStatusMap[keyof typeof NotifyStatusMap]