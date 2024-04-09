import 'reflect-metadata'
import { describe, expect, test } from 'vitest'
import DeviceEvent from '../../entity/event/event'
import { DeviceStatusMap } from '../../type/device/device'
import { NotifyStatusMap } from '../../type/event/notifyStatus'
import { IDeviceDatabase } from '../../entity/event/deviceDatabaseInterface'
import { DeviceItem } from '../../type/database/dynamodb/device'
import { container } from 'tsyringe'
import { IChat } from '../../entity/event/chatInterface'
import { IRemoteControl } from '../../entity/event/remoteControlInterface'

class FakeDeviceDatabase implements IDeviceDatabase {
	public getItem = async (deviceId: string): Promise<DeviceItem> => {
		if (deviceId === 'dummyDeviceId') {
			return {
				Id: deviceId,
				Status: DeviceStatusMap.Detect,
				Battery: 100,
				MessageId: 'Noting'
			}
		}

		if (deviceId === 'dummyNeedDeviceId') {
			return {
				Id: deviceId,
				Status: DeviceStatusMap.NotDetect,
				Battery: 100,
				MessageId: 'dummyMessageId'
			}
		}

		if (deviceId === 'dummyTurnOffDeviceId') {
			return {
				Id: deviceId,
				Status: DeviceStatusMap.NotDetect,
				Battery: 100,
				MessageId: 'dummyMessageId'
			}
		}

		return {
			Id: 'nothing',
			Status: DeviceStatusMap.NotDetect,
			Battery: 0,
			MessageId: 'nothing'
		}
	}
}

class FakeSlack implements IChat {
	public send = async (message: string): Promise<void> => {
		return
	}
}

class FakeRemoteControl implements IRemoteControl {
	public isWorking = async (nickname: string): Promise<boolean> => {
		return nickname !== 'turnOffAppliance';
	}
}

container.register('IDeviceDatabase', {
	useClass: FakeDeviceDatabase
})

container.register('IChat', {
	useClass: FakeSlack
})

container.register('IRemoteControl', {
	useClass: FakeRemoteControl
})

describe('notify', () => {
	test('do not need to notify because a latest device message id is not match', async () => {
		const event = new DeviceEvent('dummyMessageId', 'dummyDeviceId', DeviceStatusMap.NotDetect, 100, 'turnOnAppliance')
		const actual = await event.notify()

		expect(actual).toEqual(NotifyStatusMap.NotNeed)
	})

	test('need to notify because a latest device message id is match', async () => {
		const event = new DeviceEvent('dummyMessageId', 'dummyNeedDeviceId', DeviceStatusMap.NotDetect, 100, 'turnOnAppliance')
		const actual = await event.notify()

		expect(actual).toEqual(NotifyStatusMap.Need)
	})

	test('do not need to notify because air conditioning does not turn on', async () => {
		const event = new DeviceEvent('dummyMessageId', 'dummyTurnOffDeviceId', DeviceStatusMap.NotDetect, 100, 'turnOffAppliance')
		const actual = await event.notify()

		expect(actual).toEqual(NotifyStatusMap.NotNeedWithTurningOn)
	})
})