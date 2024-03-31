export const FinishStateMap = {
	Nothing: 'Nothing',
	RegisterForCreateMessage: 'RegisterForCreateMessage',
} as const
export type FinishState = typeof FinishStateMap[keyof typeof FinishStateMap]