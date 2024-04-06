import { IRemoteControl } from '../../entity/remoteControlInterface'
import { RestClient } from 'typed-rest-client'
import { NATURE_REMO_API_BASE_URL, NATURE_REMO_API_TOKEN } from '../../constant/nature/nature'
import { NatureAppliance } from '../../type/nature/appliance'
import { NatureGetAppliancesError, NatureTurnOffError } from '../../lib/error/nature'

export default class NatureRemoteControl implements IRemoteControl {
	private readonly client: RestClient

	constructor() {
		this.client = new RestClient('home-controller', NATURE_REMO_API_BASE_URL)
	}

	public turnOff = async (nickname: string): Promise<void> => {
		let appliances: NatureAppliance[]

		try {
			const response = await this.client.get<NatureAppliance[]>(
				'/1/appliances',
				{ additionalHeaders: { Authorization: `Bearer ${NATURE_REMO_API_TOKEN}` } }
			)

			appliances = response.result || []

		} catch (e) {
			console.error(`Failed to get appliances from Nature Remo: ${e}`)
			throw new NatureGetAppliancesError(500, `Failed to get appliances from Nature Remo`)
		}

		for (const appliance of appliances) {
			if (appliance.nickname === nickname) {
				try {
					await this.client.create(
						`/1/appliances/${appliance.id}/aircon_settings?button=power-off`,
						{},
						{
							additionalHeaders: { Authorization: `Bearer ${NATURE_REMO_API_TOKEN}` }
						}
					)

					break

				} catch (e) {
					console.error(
						`Failed to turn off an air conditioning: ${e},
						appliance nickname: ${nickname}`
					)

					throw new NatureTurnOffError(500, `Failed to turn off an air conditioning`)
				}
			}
		}
	}
}