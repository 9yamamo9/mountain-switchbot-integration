import { autoInjectable, inject } from 'tsyringe'
import { IRemoteControl } from './remoteControlInterface'
import { NatureControlError } from '../lib/error/nature'
import { BaseErrorWithServiceCode, BaseErrorWithStatusCode, RepositoryCallErrorWithServiceCode } from 'base-error'
import { IChat } from './chatInterface'

@autoInjectable()
export default class Nature {
	private readonly nickname: string
	private readonly control?: IRemoteControl
	private readonly chat?: IChat

	constructor(
		nickname: string,
		@inject('IRemoteControl') control?: IRemoteControl,
		@inject('IChat') chat?: IChat
	) {
		this.nickname = nickname
		this.control = control
		this.chat = chat
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

		if (!this.chat) {
			console.error('the chat repository can be undefined')
			throw new RepositoryCallErrorWithServiceCode(500, 100002, 'Can NOT call chat repository')
		}

		try {
			await this.control.turnOff(this.nickname)
		} catch (e) {
			if (e instanceof BaseErrorWithStatusCode) {
				console.error(`Filed to turn off an air conditioning: ${e.message}`)
				throw new NatureControlError(e.statusCode, 100001, `Failed to control an appliance`)
			}
		}

		try {
			await this.chat.send(`Turn off ${this.nickname}.`)
		} catch (e) {
			if (e instanceof BaseErrorWithStatusCode) {
				console.error(`Failed to send a message: ${e.message}`)
				throw new NatureControlError(e.statusCode, 100001, 'Failed to send a message')
			}
		}
	}
}