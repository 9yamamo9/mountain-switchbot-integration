import { RestClient } from 'typed-rest-client'
import { autoInjectable, inject } from 'tsyringe'
import { IRemoteControl } from './remoteControlInterface'

@autoInjectable()
export default class Nature {
	private readonly nickname: string
	private readonly control?: IRemoteControl

	constructor(
		nickname: string,
		@inject('IRemoteControl') control?: IRemoteControl
	) {
		this.nickname = nickname
		this.control = control
	}

	public turnOff = async (): Promise<void> => {
		await this.control.turnOff(this.nickname)
	}
}