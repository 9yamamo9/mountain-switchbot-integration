import { BaseErrorWithServiceCode, BaseErrorWithStatusCode } from './base'

export class NatureGetAppliancesError extends BaseErrorWithStatusCode {}
export class NatureTurnOffError extends BaseErrorWithStatusCode {}
export class NatureControlError extends BaseErrorWithServiceCode {}