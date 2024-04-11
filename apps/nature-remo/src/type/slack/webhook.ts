export type SlackWebhookRequest = {
	type: string
	user:	SlackUser
	channel: SlackChannel
	message: SlackMessage
	response_url: string
	actions: SlackAction[]
}

type SlackUser = {
	id: string
	username: string
	name: string
	team_id: string
}

type SlackChannel = {
	id: string
	name: string
}

type SlackMessage = {
	subtype: string
	text: string
	type: string
	ts: string
	bot_id: string
	blocks: SlackBlock[]
}

type SlackBlock = {
	type: string
	block_id: string
	text: SlackText
	accessory: SlackAccessory
}

type SlackText = {
	type: string
	text: string
	verbatim: boolean
}

type SlackAccessory = {
	type: string
	style: string
	text: SlackAccessoryText
	value: string
	action_id: string
}

type SlackAccessoryText = {
	type: string
	text: string
	emoji: boolean
}

type SlackAction = {
	action_id: string
	block_id: string
	text: SlackAccessoryText
	value: string
	style: string
	type: string
	action_ts: string
}

type SlackActionText = {
	type: string
	text: string
	emoji: boolean
}
