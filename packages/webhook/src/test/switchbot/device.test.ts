import 'reflect-metadata'
import { describe, expect, test, vi } from 'vitest'
import { IDeviceDatabase } from '../../entity/switchbot/deviceDatabaseInterface'
import Device from '../../entity/switchbot/device'
import { container } from 'tsyringe'
import { DeviceItem, DeviceStatusMap } from '../../type/database/dynamodb/device'
import { IDeviceQueue } from '../../entity/switchbot/deviceQueueInterface'

class FakeDeviceDynamoDB implements IDeviceDatabase {
	public getItem = async (deviceId: string): Promise<DeviceItem | undefined> => {
		if (deviceId === 'dummyDevice') {
			return {
				id: deviceId,
				status: DeviceStatusMap.Detect,
				battery: 100,
				messageId: 'dummyMessageId'
			}
		} else {
			return undefined
		}
	}

	public register = async (device: Device) => {
		console.log('device:', device)
	}
}

class FakeDeviceQueue implements IDeviceQueue {
	public send = async (device: Device): Promise<string> => {
		return ''
	}

	public delete = async (messageId: string): Promise<void> => {}

	public isExist = async (messageId: string): Promise<boolean> => {
		return true
	}
}

describe('notify', () => {
	test('success to send a message that tell you to need to turn off air conditioning', async () => {
		container.register('IDeviceDatabase', {
			useClass: FakeDeviceDynamoDB,
		})

		container.register('IDeviceQueue', {
			useClass: FakeDeviceQueue
		})

		const device = new Device('dummyDevice', 'Detect', 100)

		await device.notify()
	})
})