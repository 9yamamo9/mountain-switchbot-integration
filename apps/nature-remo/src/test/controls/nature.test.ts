import 'reflect-metadata'
import { describe, test } from 'vitest'
import Nature from '../../entity/nature'
import { IRemoteControl } from '../../entity/remoteControlInterface'
import { container } from 'tsyringe'
import { IChat } from '../../entity/chatInterface'

class FakeRemoteControl implements IRemoteControl {
	public turnOff = async (): Promise<void> => {}
}

class FakeChat implements IChat {
	public send = async (message: string): Promise<void> => {}
}

container.register('IRemoteControl', {
	useClass: FakeRemoteControl
})

container.register('IChat', {
	useClass: FakeChat
})

describe('turnOff', () => {
	test('success to turn off', async () => {
		const nature = new Nature('the air conditioning in the bedroom')

		await nature.turnOff()
	})
})
