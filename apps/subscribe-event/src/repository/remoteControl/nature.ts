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

	public getWorkingApplianceNicknames = async (): Promise<string[]> => {
		let workingApplianceNicknames: string[]

		try {
			const response = await this.client.get<NatureAppliance[]>(
				'/1/appliances',
				{ additionalHeaders: { Authorization: `Bearer ${NATURE_REMO_API_TOKEN}` } }
			)

			workingApplianceNicknames = response.result?.filter((appliance) => appliance.settings.button !== 'power-off')
				.map((appliance) => appliance.nickname) || []
		} catch (e) {
			console.error(`Failed to get appliances from Nature Remo: ${e}`)
			throw new NatureGetAppliancesError(500, `Failed to get appliances from Nature Remo`)
		}

		return workingApplianceNicknames
	}
}