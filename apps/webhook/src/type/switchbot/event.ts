export interface Event {
	eventType: string
	eventVersion: string
	context: EventContext
}
interface EventContext {
	deviceType: string
	deviceMac: string
	detectionState: string
	battery: number
	timeOfSample: number
}