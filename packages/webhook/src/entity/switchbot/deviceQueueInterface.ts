import Device from './device'

export interface IDeviceQueue {
	send: (device: Device) => Promise<string>
	delete: (messageId: string) => Promise<void>
	isExist: (messageId: string) => Promise<boolean>
}