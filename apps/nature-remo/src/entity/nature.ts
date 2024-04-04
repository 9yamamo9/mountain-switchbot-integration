import { autoInjectable, inject } from 'tsyringe'
import { IRemoteControl } from './remoteControlInterface'
import { BaseErrorWithServiceCode } from '../lib/error/base'
import { NatureControlError } from '../lib/error/nature'

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
		try {
			await this.control.turnOff(this.nickname)
		} catch (e) {
			if (e instanceof BaseErrorWithServiceCode) {
				console.error(`Filed to turn off an air conditioning: ${e.message}`)
				throw new NatureControlError(e.serviceCode, 100001, `Failed to control an appliance`)
			}
		}
	}
}