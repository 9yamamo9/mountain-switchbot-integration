import { autoInjectable, inject } from 'tsyringe'
import { IDeviceDatabase } from './deviceDatabaseInterface'
import { IDeviceQueue } from './deviceQueueInterface'
import { FinishState, FinishStateMap } from '../../type/switchbot/finishState'
import { DeviceStatusMap } from '../../type/switchbot/device'

@autoInjectable()
export default class Device {
	readonly id: string
	readonly status: string
	readonly battery: number
	private readonly database?: IDeviceDatabase
	private readonly queue?: IDeviceQueue

	constructor(
		id: string,
		status: string,
		battery: number,
		@inject('IDeviceDatabase') database?: IDeviceDatabase,
		@inject('IDeviceQueue') queue?: IDeviceQueue
	) {
		this.id = id
		this.status = status
		this.battery = battery
		this.database = database
		this.queue = queue
	}

	public notify = async (): Promise<FinishState> => {
		try {
			let latestMessageId = 'none'
			let finishState: FinishState = FinishStateMap.Nothing

			switch (this.status) {
				case DeviceStatusMap.Detect:
					break
				case DeviceStatusMap.NotDetect:
					latestMessageId = await this.queue.send(this)
					finishState = FinishStateMap.RegisterForCreateMessage
					break
				default:
					break
			}

			await this.database.register(this, latestMessageId)

			return finishState
		} catch (e) {
			throw e
		}
	}
}