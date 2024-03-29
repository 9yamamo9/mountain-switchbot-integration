import Device from './device'

export interface IDeviceDatabase {
	register: (device: Device) => Promise<void>
}