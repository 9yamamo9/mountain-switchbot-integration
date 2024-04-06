import { autoInjectable, inject } from 'tsyringe'
import { IRemoteControl } from './remoteControlInterface'
import { NatureControlError } from '../lib/error/nature'
import { BaseErrorWithServiceCode, RepositoryCallErrorWithServiceCode } from 'base-error'

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

	/**
	 * @throws RepositoryCallErrorWithServiceCode
	 * @throws BaseErrorWithServiceCode
	 */
	public turnOff = async (): Promise<void> => {
		if (!this.control) {
			console.error('the control repository can be undefined')
			throw new RepositoryCallErrorWithServiceCode(500, 100002, 'Can NOT call control repository')
		}

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