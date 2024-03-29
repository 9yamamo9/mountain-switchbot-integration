import { autoInjectable, inject } from 'tsyringe'
import { IDeviceDatabase } from './deviceDatabaseInterface'

@autoInjectable()
export default class Device {
	private readonly id: string
	private readonly status: string
	private readonly battery: number
	private readonly database: IDeviceDatabase

	constructor(
		id: string,
		status: string,
		battery: number,
		@inject('IDeviceDatabase') database?: IDeviceDatabase
	) {
		this.id = id
		this.status = status
		this.battery = battery
		this.database = database
	}

	public notify = async () => {
		await this.database.register(this)
	}
}