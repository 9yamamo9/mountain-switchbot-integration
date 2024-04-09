export interface IRemoteControl {
	isWorking: (nickname: string) => Promise<boolean>
}