import { describe, expect, it } from 'vitest'
import { BaseErrorWithServiceCode, BaseErrorWithStatusCode } from '../index'

describe('BaseError', () => {
	it('BaseErrorWithStatusCode', () => {
		const actual = new BaseErrorWithStatusCode(500, 'test message')

		expect(actual.name).toEqual('BaseErrorWithStatusCode')
		expect(actual.statusCode).toEqual(500)
		expect(actual.message).toEqual('test message')
	})

	it('BaseErrorWithServiceCode', () => {
		const actual = new BaseErrorWithServiceCode(401, 100001, 'test message')

		expect(actual.name).toEqual('BaseErrorWithServiceCode')
		expect(actual.statusCode).toEqual(401)
		expect(actual.serviceCode).toEqual(100001)
		expect(actual.message).toEqual('test message')
	})
})