import { IRemoteControl } from '../../entity/event/remoteControlInterface'
import { RestClient } from 'typed-rest-client'
import { NATURE_REMO_API_BASE_URL, NATURE_REMO_API_TOKEN } from '../../constant/nature/nature'
import { NatureAppliance } from '../../type/nature/appliance'
import { NatureGetAppliancesError } from '../../lib/error/nature'

export default class NatureRemoteControl implements IRemoteControl {
	private readonly client: RestClient

	constructor() {
		this.client = new RestClient('home-controller', NATURE_REMO_API_BASE_URL)
	}

	public isWorking = async (nickname: string): Promise<boolean> => {
		let appliances: NatureAppliance[]
		let isWorked: boolean = true

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
			if (appliance.nickname === nickname && appliance.settings.button === 'power-off') {
				isWorked = false
				break
			}
		}

		return isWorked
	}
}