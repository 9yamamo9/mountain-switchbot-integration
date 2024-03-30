export const FinishStateMap = {
	Others: 'Others',
	RegisterWithoutPreviousDevice: 'FinishWithoutPreviousDevices',
	RegisterForDeleteMessage: 'RegisterForDeleteMessage',
	RegisterForCreateMessage: 'RegisterForCreateMessage',
	RegisterForUpdateMessage: 'RegisterForUpdateMessage',

} as const
export type FinishState = typeof FinishStateMap[keyof typeof FinishStateMap]