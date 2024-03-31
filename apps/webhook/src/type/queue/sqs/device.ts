export interface DeviceMessage {
	Id: string
	Status: string // FIXME: convert DeviceStatus type
	Battery: number
}