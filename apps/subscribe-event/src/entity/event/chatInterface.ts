export interface IChat {
	send: (message: string) => Promise<void>
}