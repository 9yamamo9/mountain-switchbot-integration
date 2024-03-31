import Device from './device'

export interface IDeviceQueue {
	send: (device: Device) => Promise<string>
}