import { IChat } from '../../entity/event/chatInterface'
import { SLACK_CHANNEL_RESOURCE, SLACK_WEBHOOK_BASE_URL } from '../../constant/chat/slack'
import { IncomingWebhook } from '@slack/webhook'
import { SendMessageError } from '../../lib/error/chat'

export default class Slack implements IChat {
	private readonly client: IncomingWebhook

	constructor() {
		this.client = new IncomingWebhook(`${SLACK_WEBHOOK_BASE_URL}${SLACK_CHANNEL_RESOURCE}`)
	}

	public send = async (message: string, applianceNickname: string): Promise<void> => {
		try {
			await this.client.send({
				text: message,
				blocks: [
					{
						type: 'section',
						text: {
							type: 'mrkdwn',
							text: message
						},
						accessory: {
							type: 'button',
							text: {
								type: 'plain_text',
								text: 'Turn Off'
							},
							style: 'primary',
							value: `turn_off_${applianceNickname}`
						}
					}
				]
			})
		} catch (e) {
			if (e instanceof Error) {
				console.error(`Failed to send a message to Slack channel: ${e.message}`)
				throw new SendMessageError(500, 'Failed to send a message to Slack channel')
			}
		}
	}
}