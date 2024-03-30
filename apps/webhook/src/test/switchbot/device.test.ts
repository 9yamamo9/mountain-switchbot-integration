import 'reflect-metadata'
import { describe, expect, test } from 'vitest'
import { IDeviceDatabase } from '../../entity/switchbot/deviceDatabaseInterface'
import Device from '../../entity/switchbot/device'
import { container } from 'tsyringe'
import { DeviceItem, DeviceStatusMap } from '../../type/database/dynamodb/device'
import { IDeviceQueue } from '../../entity/switchbot/deviceQueueInterface'
import { FinishStateMap } from '../../type/switchbot/finishState'

class FakeDeviceDynamoDB implements IDeviceDatabase {
	public getItem = async (deviceId: string): Promise<DeviceItem | undefined> => {
		if (deviceId === 'dummyDeviceId') {
			return {
				Id: deviceId,
				Status: DeviceStatusMap.Detect,
				Battery: 100,
				MessageId: 'dummyMessageId'
			}
		} else if (deviceId === 'deleteDeviceId') {
			return {
				Id: deviceId,
				Status: DeviceStatusMap.NotDetect,
				Battery: 100,
				MessageId: 'deleteMessageId'
			}
		} else if (deviceId === 'updateDeviceId') {
			return {
				Id: deviceId,
				Status: DeviceStatusMap.NotDetect,
				Battery: 100,
				MessageId: 'updateMessageId'
			}
		} else if (deviceId === 'newDeviceId') {
			return undefined
		} else {
			return undefined
		}
	}

	public register = async (device: Device) => {}
}

class FakeDeviceQueue implements IDeviceQueue {
	public send = async (device: Device): Promise<string> => {
		return ''
	}

	public delete = async (messageId: string): Promise<void> => {}

	public isExist = async (messageId: string): Promise<boolean> => {
		return messageId !== 'updateMessageId'
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

		const device = new Device('dummyDeviceId', DeviceStatusMap.NotDetect, 100)
		const actual = await device.notify()

		expect(actual).toEqual(FinishStateMap.RegisterForCreateMessage)
	})

	test('success to send a new message without a previous device.', async () => {
		container.register('IDeviceDatabase', {
			useClass: FakeDeviceDynamoDB
		})

		container.register('IDeviceQueue', {
			useClass: FakeDeviceQueue
		})

		const device = new Device('newDeviceId', DeviceStatusMap.NotDetect, 100)
		const actual = await device.notify()

		expect(actual).toEqual(FinishStateMap.RegisterWithoutPreviousDevice)
	})

	test('success to delete a message that is not necessary.', async () => {
		container.register('IDeviceDatabase', {
			useClass: FakeDeviceDynamoDB
		})

		container.register('IDeviceQueue', {
			useClass: FakeDeviceQueue
		})

		const device = new Device('deleteDeviceId', DeviceStatusMap.Detect, 100)
		const actual = await device.notify()

		expect(actual).toEqual(FinishStateMap.RegisterForDeleteMessage)
	})

	test('success to update a message for a previous message is not exits', async () => {
		container.register('IDeviceDatabase', {
			useClass: FakeDeviceDynamoDB
		})

		container.register('IDeviceQueue', {
			useClass: FakeDeviceQueue
		})

		const device = new Device('updateDeviceId', DeviceStatusMap.NotDetect, 100)
		const actual = await device.notify()

		expect(actual).toEqual(FinishStateMap.RegisterForUpdateMessage)
	})
})