export type MockModel = 'model-v1' | 'model-v2' | 'model-v3';

export type MockResponse = {
	content: string;
	state: 'success' | 'fallback' | 'unsupported';
};
