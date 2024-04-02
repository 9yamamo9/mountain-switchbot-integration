export interface IRemoteControl {
	turnOff: (nickname: string) => Promise<void>
}