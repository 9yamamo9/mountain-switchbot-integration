import { Event } from '../../type/switchbot/event'

/**
 *
 * @param event
 * @throws SyntaxError
 */
export const validate = (event: Event) => {
	if (!event.context.deviceMac || !event.context.detectionState || !event.context.battery) {
		console.error(`Device Event is invalid arguments`)

		throw new SyntaxError('Device Event is invalid arguments')
	}
}