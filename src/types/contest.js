// @flow
export type Judge = 'codeforces' | 'csacademy';
export type State = 'UPCOMING' | 'RUNNING' | 'FINISHED';

export type Contest = {
	name: string;
	code: string;
	judge: Judge;
	startTime?: Date;
	duration?: number;
	state?: State;
	url: string;
	description?: string;
}
