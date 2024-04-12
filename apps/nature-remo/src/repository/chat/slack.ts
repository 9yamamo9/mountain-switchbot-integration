import { IChat } from '../../entity/chatInterface'
import { IncomingWebhook } from '@slack/webhook'
import { SendMessageError } from '../../lib/error/chat'

export default class Slack implements IChat {
	private readonly client: IncomingWebhook

	constructor(responseUrl: string) {
		this.client = new IncomingWebhook(responseUrl)
	}

	public send = async (message: string): Promise<void> => {
		try {
			await this.client.send({
				text: message
			})
		} catch (e) {
			if (e instanceof Error) {
				console.error(`Failed to send a message to Slack channel: ${e.message}`)
				throw new SendMessageError(500, 'Failed to send a message to Slack channel')
			}
		}
	}
}