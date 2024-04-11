export interface IRemoteControl {
	getWorkingApplianceNicknames: () => Promise<string[]>
}