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

export class RepositoryCallError extends TypeError {
	constructor(public statusCode: number, e?: string) {
		super(e)
		this.name = new.target.name
	}
}

export class RepositoryCallErrorWithServiceCode extends RepositoryCallError {
	constructor(public statusCode: number, public serviceCode: number, e?: string) {
		super(statusCode, e)
	}
}