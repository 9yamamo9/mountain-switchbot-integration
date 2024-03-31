export interface Event {
	eventType: string
	eventVersion: string
	context: EventContext
}
interface EventContext {
	deviceType: string
	deviceMac: string
	detectionState: string // FIXME: convert DeviceStatus type
	battery: number
	timeOfSample: number
}