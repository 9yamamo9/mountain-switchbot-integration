import { autoInjectable, inject } from 'tsyringe'
import { IDeviceDatabase } from './deviceDatabaseInterface'
import { DeviceStatusMap } from '../../type/database/dynamodb/device'
import { IDeviceQueue } from './deviceQueueInterface'

@autoInjectable()
export default class Device {
	private readonly id: string
	private readonly status: string
	private readonly battery: number
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

	public notify = async () => {
		try {
			const previousDevice = await this.database.getItem(this.id)
			const latestMessageId = previousDevice.messageId
			let newestMessageId = ''

			if (!previousDevice) {
				if (this.status === DeviceStatusMap.NotDetect) {
					newestMessageId = await this.queue.send(this)
				}

				await this.database.register(this, newestMessageId)
				return
			}


			switch (this.status) {
				case DeviceStatusMap.Detect:
					if (previousDevice.status === DeviceStatusMap.NotDetect) {
						const existMessage = await this.queue.isExist(latestMessageId)
						if (existMessage) await this.queue.delete(latestMessageId)
					}

					break

				case DeviceStatusMap.NotDetect:
					if (previousDevice.status === DeviceStatusMap.Detect) {
						await this.queue.send(this)

					} else {
						const existMessage = await this.queue.isExist(latestMessageId)
						if (!existMessage) {
							newestMessageId = await this.queue.send(this)
						}
					}

					break

				default:
					break
			}

			await this.database.register(this, newestMessageId)

		} catch (e) {
			throw e
		}
	}
}