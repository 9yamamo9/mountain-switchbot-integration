import { IChat } from '../../entity/event/chatInterface'
import { RestClient } from 'typed-rest-client'
import { SLACK_CHANNEL_RESOURCE, SLACK_WEBHOOK_BASE_URL } from '../../constant/chat/slack'

export default class Slack implements IChat {
	private readonly client: RestClient

	constructor() {
		this.client = new RestClient('switchbot-subscriber', SLACK_WEBHOOK_BASE_URL)
	}

	public send = async (message: string): Promise<void> => {
		const payload = {
			text: message,
		}

		await this.client.create(
			SLACK_CHANNEL_RESOURCE,
			{ payload: payload }
		)
	}
}