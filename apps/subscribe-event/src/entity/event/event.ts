import { autoInjectable, inject } from 'tsyringe'
import { IDeviceDatabase } from './deviceDatabaseInterface'
import { NotifyStatus, NotifyStatusMap } from '../../type/event/notifyStatus'
import { IChat } from './chatInterface'
import { DeviceItem } from '../../type/database/dynamodb/device'
import { GetItemError } from '../../lib/error/database'
import { SendMessageError } from '../../lib/error/chat'
import { NotifyError } from '../../lib/error/event'
import { RepositoryCallErrorWithServiceCode } from 'base-error'
import { IRemoteControl } from './remoteControlInterface'
import { NatureGetAppliancesError } from '../../lib/error/nature'

@autoInjectable()
export default class DeviceEvent {
	readonly id: string
	readonly deviceId: string
	private readonly status: string
	private readonly battery: number
	private readonly database?: IDeviceDatabase
	private readonly chat?: IChat
	private readonly remoteControl?: IRemoteControl

	constructor(
		messageId: string,
		deviceId: string,
		status: string,
		battery: number,
		@inject('IDeviceDatabase') database?: IDeviceDatabase,
		@inject('IChat') chat?: IChat,
		@inject('IRemoteControl') remoteControl?: IRemoteControl
	) {
		this.id = messageId
		this.deviceId = deviceId
		this.status = status
		this.battery = battery
		this.database = database
		this.chat = chat
		this.remoteControl = remoteControl
	}

	/**
	 * @throws RepositoryCallErrorWithServiceCode
	 * @throws NotifyError
	 */
	public notify = async (): Promise<NotifyStatus> => {
		if (!this.database) {
			console.error('the database repository can be undefined')
			throw new RepositoryCallErrorWithServiceCode(500, 100002, 'Can NOT call database repository')
		}

		if (!this.chat) {
			console.error('the chat repository can be undefined')
			throw new RepositoryCallErrorWithServiceCode(500, 100002, 'Can NOT call chat repository')
		}

		if (!this.remoteControl) {
			console.error('the remote control repository can be undefined')
			throw new RepositoryCallErrorWithServiceCode(500, 100002, 'Can NOT call remote control repository')
		}

		let workingApplianceNicknames: string[] = []
		let latestDeviceItem: DeviceItem
		let notifyStatus: NotifyStatus = NotifyStatusMap.NotNeed

		try {
			workingApplianceNicknames = await this.remoteControl.getWorkingApplianceNicknames()
			if (workingApplianceNicknames.length === 0) return NotifyStatusMap.NotNeedWithTurningOn
		} catch (e) {
			if (e instanceof NatureGetAppliancesError) {
				console.log(`Continue process, but error happens: ${e.name}`)
			}
		}

		try {
			latestDeviceItem = await this.database.getItem(this.deviceId)
		} catch (e) {
			if (e instanceof GetItemError) {
				console.error(`Failed to notify a message by ${e.name}`)

				throw new NotifyError(
					e.statusCode,
					100001,
					`Failed to notify a message by ${e.name}`
				)
			}

			console.error(`Failed to notify a message by unknown error`)

			throw new NotifyError(
				500,
				100000,
				`Failed to notify a message by unknown error: ${e}`
			)
		}

		if (latestDeviceItem.MessageId !== this.id) return notifyStatus

		notifyStatus = NotifyStatusMap.Need

		for (const nickname of workingApplianceNicknames) {
			try {
				await this.chat.send(`Haven't you forgot to turn off ${nickname}?`, nickname)
			} catch (e) {
				if (e instanceof SendMessageError) {
					console.error(`Failed to notify a message by ${e.name}`)

					throw new NotifyError(
						e.statusCode,
						100001,
						`Failed to notify a message by ${e.name}`
					)
				}
			}
		}

		return notifyStatus
	}
}
