import { LONG_RESPONSE } from '../mocks/mockResponses';
import { MockResponse } from '../types/mocks';

type ScenarioKey = 'empty' | 'long' | 'unsafe' | 'unsupported' | 'markdown';

const testScenarios: Record<ScenarioKey, () => MockResponse> = {
	empty: () => ({
		content: '',
		state: 'fallback',
	}),

	long: () => ({
		content: LONG_RESPONSE,
		state: 'success',
	}),

	unsafe: () => ({
		content:
			'I\'m not able to assist with that request. If you\'d like, I can help with a safer or more appropriate alternative.',
		state: 'unsupported',
	}),

	unsupported: () => ({
		content: 'I cannot help with that request.',
		state: 'unsupported',
	}),

	markdown: () => ({
		content: `
			Here are steps:

			- Step 1
			- Step 2

			\`\`\`ts
				console.log('test');
			\`\`\`
		`,
		state: 'success',
	}),
};

const isScenarioKey = (scenario: string): scenario is ScenarioKey => {
	return scenario in testScenarios;
};


export const getMockResponse = (userPrompt: string): MockResponse => {
	const testMatch = userPrompt.match(/^\[test:(.+?)\]/);

	if (testMatch) {
		const scenario = testMatch[1];

		if (isScenarioKey(scenario)) {
			return testScenarios[scenario]();
		}

		return {
			content: 'Unknown test scenario.',
			state: 'fallback',
		};
	}

	const lowerCasePrompt = userPrompt.toLowerCase();

	if (lowerCasePrompt.includes('accessibility')) {
		return {
			content:
				'Regarding accessibility: Ensure your UI meets WCAG guidelines, including keyboard navigation and screen reader support.',
			state: 'success',
		};
	}

	if (lowerCasePrompt.includes('test')) {
		return {
			content:
				'For testing: Use Playwright for end-to-end tests and axe-core for accessibility checks.',
			state: 'success',
		};
	}

	if (lowerCasePrompt.includes('hello') || lowerCasePrompt.includes('hi')) {
		return {
			content: 'Hello! How can I assist you today?',
			state: 'success',
		};
	}

	if (lowerCasePrompt.includes('error')) {
		return {
			content: 'If you\'re encountering an error, check the console for details and ensure all dependencies are installed.',
			state: 'success',
		};
	}

	return {
		content: `I understand your query about "${userPrompt}". Here's a general response.`,
		state: 'success',
	};
};
