import 'reflect-metadata'
import { describe, expect, test } from 'vitest'
import { IDeviceDatabase } from '../../entity/switchbot/deviceDatabaseInterface'
import Device from '../../entity/switchbot/device'
import { container } from 'tsyringe'
import { IDeviceQueue } from '../../entity/switchbot/deviceQueueInterface'
import { FinishStateMap } from '../../type/switchbot/finishState'
import { DeviceStatusMap } from '../../type/switchbot/device'

class FakeDeviceDynamoDB implements IDeviceDatabase {
	public register = async (device: Device) => {}
}

class FakeDeviceQueue implements IDeviceQueue {
	public send = async (device: Device): Promise<string> => {
		return ''
	}
}

describe('notify', () => {
	test('success to send a new message', async () => {
		container.register('IDeviceDatabase', {
			useClass: FakeDeviceDynamoDB
		})

		container.register('IDeviceQueue', {
			useClass: FakeDeviceQueue
		})

		const device = new Device('dummyNotDetectedDeviceId', DeviceStatusMap.NotDetect, 100)
		const actual = await device.notify()

		expect(actual).toEqual(FinishStateMap.RegisterForCreateMessage)
	})

	test('success to ignore a detected device', async () => {
		container.register('IDeviceDatabase', {
			useClass: FakeDeviceDynamoDB
		})

		container.register('IDeviceQueue', {
			useClass: FakeDeviceQueue
		})

		const device = new Device('dummyDetectedDeviceId', DeviceStatusMap.Detect, 100)
		const actual = await device.notify()

		expect(actual).toEqual(FinishStateMap.Nothing)
	})
})