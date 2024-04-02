import { IRemoteControl } from '../../entity/remoteControlInterface'
import { RestClient } from 'typed-rest-client'
import { NATURE_REMO_API_BASE_URL, NATURE_REMO_API_TOKEN } from '../../constant/nature/nature'
import { NatureAppliance } from '../../type/nature/appliance'

export default class NatureRemoteControl implements IRemoteControl {
	private readonly client: RestClient

	constructor() {
		this.client = new RestClient('home-controller', NATURE_REMO_API_BASE_URL)
	}

	public turnOff = async (nickname: string): Promise<void> => {
		const response = await this.client.get<NatureAppliance[]>(
			'/1/appliances',
			{ additionalHeaders: { Authorization: `Bearer ${NATURE_REMO_API_TOKEN}` }}
		)
		const appliances = response.result

		for (const appliance of appliances) {
			if (appliance.nickname === nickname) {
				await this.client.create(
					`/1/appliances/${appliance.id}/aircon_settings?button=power-off`,
					{},
					{
						additionalHeaders: { Authorization: `Bearer ${NATURE_REMO_API_TOKEN}` }
					}
				)
				break
			}
		}
	}
}