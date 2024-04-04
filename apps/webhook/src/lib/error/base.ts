export class BaseErrorWithStatusCode extends Error {
	constructor(public statusCode: number, e?: string) {
		super(e)
		this.name = new.target.name
	}
}

export class BaseErrorWithServiceCode extends BaseErrorWithStatusCode {
	constructor(public readonly statusCode: number, public readonly serviceCode: number, e?: string) {
		super(statusCode, e)
		this.name = new.target.name
	}
}