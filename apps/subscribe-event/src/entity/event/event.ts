import { autoInjectable, inject } from 'tsyringe'
import { IDeviceDatabase } from './deviceDatabaseInterface'
import { NotifyStatus, NotifyStatusMap } from '../../type/event/notifyStatus'
import { IChat } from './chatInterface'

@autoInjectable()
export default class DeviceEvent {
	readonly id: string
	readonly deviceId: string
	private readonly status: string
	private readonly battery: number
	private readonly database?: IDeviceDatabase
	private readonly chat?: IChat

	constructor(
		messageId: string,
		deviceId: string,
		status: string,
		battery: number,
		@inject('IDeviceDatabase') database?: IDeviceDatabase,
		@inject('IChat') chat?: IChat
	) {
		this.id = messageId
		this.deviceId = deviceId
		this.status = status
		this.battery = battery
		this.database = database
		this.chat = chat
	}

	public notify = async (): Promise<NotifyStatus> => {
		let notifyStatus: NotifyStatus = NotifyStatusMap.NotNeed

		const latestDeviceItem = await this.database.getItem(this.deviceId)

		if (latestDeviceItem.MessageId !== this.id) return notifyStatus

		notifyStatus = NotifyStatusMap.Need

		await this.chat.send(`Haven't you forgot to turn off the air conditioning?`)

		return notifyStatus
	}
}