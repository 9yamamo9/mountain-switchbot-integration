import 'reflect-metadata'
import { describe, test } from 'vitest'
import Nature from '../../entity/nature'
import { IRemoteControl } from '../../entity/remoteControlInterface'
import { container, registry } from 'tsyringe'

class FakeRemoteControl implements IRemoteControl {
	public turnOff = async (): Promise<void> => {}
}
describe('turnOff', () => {
	test('success to turn off', async () => {
		container.register('IRemoteControl', {
			useClass: FakeRemoteControl
		})

		const nature = new Nature('the air conditioning in the bedroom')

		await nature.turnOff()
	})
})