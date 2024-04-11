export interface IChat {
	send: (message: string, applianceNickname: string) => Promise<void>
}