export const getMockResponse = (userPrompt: string): string => {
	const lowerCasePrompt = userPrompt.toLowerCase();

	if (lowerCasePrompt.includes('accessibility')) {
		return 'Regarding accessibility: Ensure your UI meets WCAG guidelines, including keyboard navigation and screen reader support.';
	}

	if (lowerCasePrompt.includes('test')) {
		return 'For testing: Use Playwright for end-to-end tests and axe-core for accessibility checks.';
	}

	if (lowerCasePrompt.includes('hello') || lowerCasePrompt.includes('hi')) {
		return 'Hello! How can I assist you today?';
	}

	if (lowerCasePrompt.includes('error')) {
		return 'If you\'re encountering an error, check the console for details and ensure all dependencies are installed.';
	}

	return `I understand your query about "${userPrompt}". Here's a general response: This is a mock assistant reply.`;
};
