export interface NatureAppliance {
	id: string
	type: string
	nickname: string
	image: string
	device: NatureDevice
	model: NatureModel
	settings: NatureSettings
}

interface NatureDevice {
	name: string
	id: string
	created_at: string
	updated_at: string
	mac_address: string
	bt_mac_address: string
	serial_number: string
	firmware_version: string
	temperature_offset: number
	humidity_offset: number
}

interface NatureModel {
	id: string
	manufacturer: string,
	remote_name: string,
	series: string,
	name: string,
	image: string
}

interface NatureSettings {
	temp: string
	temp_unit: string
	mode: string
	vol: string
	dir: string
	dirh: string
	button: string
	updated_at: string
}