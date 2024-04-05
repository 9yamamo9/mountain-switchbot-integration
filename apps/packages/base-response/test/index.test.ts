import { describe, expect, it } from 'vitest'
import { messageResponse, messageResponseWithServiceCode } from '../index'

describe('BaseResponse', () => {
	it('messageResponse', () => {
		const actual = messageResponse(500, 'test message')

		expect(actual.statusCode).toEqual(500)
		expect(actual.body).toEqual(JSON.stringify({ message: 'test message' }))
	})

	it('messageResponseWithServiceCode', () => {
		const actual = messageResponseWithServiceCode(500, 100001, 'test message')

		expect(actual.statusCode).toEqual(500)
		expect(actual.body).toEqual(JSON.stringify({ message: 'test message', serviceCode: 100001 }))
	})
})