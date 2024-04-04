import { BaseErrorWithStatusCode } from '../../lib/error'

export class DeviceDynamoDBError extends BaseErrorWithStatusCode {
	constructor(public statusCode: number, e?: string) {
		super(statusCode, e)
		this.name = new.target.name
	}
}