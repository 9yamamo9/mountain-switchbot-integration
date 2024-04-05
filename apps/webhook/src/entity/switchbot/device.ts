import { autoInjectable, inject } from 'tsyringe'
import { IDeviceDatabase } from './deviceDatabaseInterface'
import { IDeviceQueue } from './deviceQueueInterface'
import { FinishState, FinishStateMap } from '../../type/switchbot/finishState'
import { DeviceStatusMap } from '../../type/switchbot/device'
import { SendMessageError } from '../../lib/error/queue'
import { NotifyError } from '../../lib/error/device'
import { RegisterError } from '../../lib/error/database'
import { RepositoryCallErrorWithServiceCode } from 'base-error'

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
		if (!this.database) {
			console.error('the database repository can be undefined')
			throw new RepositoryCallErrorWithServiceCode(500, 100002, 'Can NOT call database repository')
		}

		if (!this.queue) {
			console.error('the queue repository can be undefined')
			throw new RepositoryCallErrorWithServiceCode(500, 100002, 'Can NOT call queue repository')
		}

		let latestMessageId = 'none'
		let finishState: FinishState = FinishStateMap.Nothing

		switch (this.status) {
			case DeviceStatusMap.Detect:
				break

			case DeviceStatusMap.NotDetect:


				try {

					latestMessageId = await this.queue.send(this)
				} catch (e) {
					if (e instanceof SendMessageError) {
						console.error(`Failed to notify a switchbot device event by ${e.name}`)
						throw new NotifyError(
							e.statusCode,
							100001,
							`Failed to notify a switchbot device event by ${e.name}`
						)
					}
				}

				finishState = FinishStateMap.RegisterForCreateMessage

				break

			default:
				break
		}

		try {
			await this.database.register(this, latestMessageId)
		} catch (e) {
			if (e instanceof RegisterError) {
				console.error(`Failed to notify a switchbot device event by ${e.name}`)
				throw new NotifyError(
					e.statusCode,
					100001,
					`Failed to notify a switchbot device event by ${e.name}`
				)
			}
		}

		return finishState
	}
}