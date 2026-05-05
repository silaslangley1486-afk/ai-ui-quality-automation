export type MockResponse = {
	content: string;
	state: 'success' | 'fallback' | 'unsupported';
};
