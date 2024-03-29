import 'reflect-metadata'
import { describe, test } from 'vitest'
import { IDeviceDatabase } from '../../entity/switchbot/deviceDatabaseInterface'
import Device from '../../entity/switchbot/device'
import { container } from 'tsyringe'

class FakeDeviceDynamoDB implements IDeviceDatabase {
	public register = async (device: Device) => {
		console.log('device:', device)
	}
}

describe('notify', () => {
	test('success to send a message that tell you to need to turn off air conditioning', () => {
		container.register('IDeviceDatabase', {
			useClass: FakeDeviceDynamoDB,
		})

		const device = new Device('dummyDevice', 'Detect', 100)
		device.notify()
	})
})