import type { MockModel, MockResponse } from '../types/mocks';
import { LONG_RESPONSE, MARKDOWN_RESPONSE } from '../mocks/mockResponses';

type ScenarioKey = 'empty' | 'long' | 'markdown' | 'unsupported' | 'unsafe';

const testScenarios: Record<ScenarioKey, () => MockResponse> = {
	empty: () => ({
		content: '',
		state: 'fallback',
	}),

	long: () => ({
		content: LONG_RESPONSE,
		state: 'success',
	}),

	markdown: () => ({
		content: MARKDOWN_RESPONSE,
		state: 'success',
	}),

	unsupported: () => ({
		content: 'I cannot help with that request.',
		state: 'unsupported',
	}),

	unsafe: () => ({
		content:
			'I’m not able to assist with that request. I can help with a safer or more appropriate alternative.',
		state: 'unsupported',
	}),
};

const isScenarioKey = (scenario: string): scenario is ScenarioKey => {
	return scenario in testScenarios;
};

const getModelPrefix = (selectedModel: MockModel) => {
	switch (selectedModel) {
		case 'model-v1':
			return '[Model V1]';

		case 'model-v2':
			return '[Model V2 - concise]';

		case 'model-v3':
			return '[Model V3 - detailed]';
	}
};

const withModelContext = (
	response: MockResponse,
	selectedModel: MockModel,
): MockResponse => ({
	...response,
	content: `${getModelPrefix(selectedModel)} ${response.content}`,
});

export const getMockResponse = (
	userPrompt: string,
	selectedModel: MockModel,
): MockResponse => {
	const testMatch = userPrompt.match(/^\[test:(.+?)\]/);

	if (testMatch) {
		const scenario = testMatch[1];

		if (isScenarioKey(scenario)) {
			return withModelContext(testScenarios[scenario](), selectedModel);
		}

		return withModelContext(
			{
				content: 'Unknown test scenario.',
				state: 'fallback',
			},
			selectedModel,
		);
	}

	const lowerCasePrompt = userPrompt.toLowerCase();

	if (lowerCasePrompt.includes('accessibility')) {
		return withModelContext(
			{
				content:
					'Regarding accessibility: Ensure your UI meets WCAG guidelines, including keyboard navigation and screen reader support.',
				state: 'success',
			},
			selectedModel,
		);
	}

	if (lowerCasePrompt.includes('test')) {
		return withModelContext(
			{
				content:
					'For testing: Use Playwright for end-to-end tests and axe-core for accessibility checks.',
				state: 'success',
			},
			selectedModel,
		);
	}

	if (lowerCasePrompt.includes('hello') || lowerCasePrompt.includes('hi')) {
		return withModelContext(
			{
				content: 'Hello! How can I assist you today?',
				state: 'success',
			},
			selectedModel,
		);
	}

	if (lowerCasePrompt.includes('error')) {
		return withModelContext(
			{
				content:
					"If you're encountering an error, check the console for details and ensure all dependencies are installed.",
				state: 'success',
			},
			selectedModel,
		);
	}

	return withModelContext(
		{
			content: `I understand your query about "${userPrompt}". Here's a general response: This is a mock assistant reply.`,
			state: 'success',
		},
		selectedModel,
	);
};