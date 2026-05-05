import { computed, ref, watch } from 'vue';
import { Message } from '../types/chat';
import { WELCOME_MESSAGE } from '../constants/chat';
import { getMockResponse } from '../services/mockAssistant';
import { DEFAULT_MODEL, DEFAULT_RESPONSE_DELAY } from '../constants';
import { ThemeMode } from '../types/ui';

export const useChat = () => {
	const prompt = ref('');
	const isLoading = ref(false);
	const selectedModel = ref(DEFAULT_MODEL);
	const errorSimulationEnabled = ref(false);
	const themeMode = ref<ThemeMode>('light');
	const reducedMotionEnabled = ref(false);
	const responseDelay = ref(DEFAULT_RESPONSE_DELAY);
	const messages = ref<Message[]>([WELCOME_MESSAGE]);

	const isSendDisabled = computed(
		() => isLoading.value || prompt.value.trim().length === 0,
	);

	const updateDocumentAttributes = () => {
		if (typeof document === 'undefined') return;

		const html = document.documentElement;

		html.dataset.theme = themeMode.value;
		html.dataset.reducedMotion = reducedMotionEnabled.value ? 'true' : 'false';
	};

	watch([themeMode, reducedMotionEnabled], updateDocumentAttributes, {
		immediate: true,
	});

	const clearConversation = () => {
		messages.value = [WELCOME_MESSAGE];
		prompt.value = '';
	};

	const delayResponse = () => new Promise((resolve) => setTimeout(resolve, responseDelay.value));

	const retryMessage = async (messageId: string) => {
		const errorMessageIndex = messages.value.findIndex(
			(message) => message.id === messageId,
		);

		if (errorMessageIndex === -1) return;

		const errorMessage = messages.value[errorMessageIndex];
		const userMessageId = errorMessage.replyToMessageId;

		if (!userMessageId) return;

		const userMessage = messages.value.find(
			(message) => message.id === userMessageId,
		);

		if (!userMessage || userMessage.role !== 'user') return;

		const userContent = userMessage.content;

		messages.value.splice(errorMessageIndex, 1);
		isLoading.value = true;

		const loadingMessageId = `assistant-loading-${Date.now()}`;

		messages.value.push({
			id: loadingMessageId,
			role: 'assistant',
			content: 'Processing your request...',
			state: 'loading',
			replyToMessageId: userMessageId,
		});

		await delayResponse();

		const loadingIndex = messages.value.findIndex(
			(message) => message.id === loadingMessageId,
		);

		if (loadingIndex !== -1) {
			const mockResponse = getMockResponse(userContent);

			messages.value[loadingIndex].content = mockResponse.content;
			messages.value[loadingIndex].state = mockResponse.state;
		}

		isLoading.value = false;
	};

	const sendMessage = async () => {
		const content = prompt.value.trim();

		if (!content || isLoading.value) return;

		const userMessageId = `user-${Date.now()}`;

		messages.value.push({
			id: userMessageId,
			role: 'user',
			content,
		});

		prompt.value = '';
		isLoading.value = true;

		const loadingMessageId = `assistant-loading-${Date.now()}`;

		messages.value.push({
			id: loadingMessageId,
			role: 'assistant',
			content: 'Processing your request...',
			state: 'loading',
			replyToMessageId: userMessageId,
		});

		await delayResponse();

		const loadingIndex = messages.value.findIndex(
			(message) => message.id === loadingMessageId,
		);

		if (loadingIndex === -1) {
			isLoading.value = false;

			return;
		}

		if (errorSimulationEnabled.value) {
			messages.value[loadingIndex] = {
				id: `assistant-error-${Date.now()}`,
				role: 'assistant',
				content: `Error: The assistant encountered an issue processing your request. (Model: ${selectedModel.value})`,
				state: 'error',
				replyToMessageId: userMessageId,
			};
		} else {
			const mockResponse = getMockResponse(content);

			messages.value[loadingIndex] = {
				id: `assistant-${Date.now()}`,
				role: 'assistant',
				content: mockResponse.content,
				state: mockResponse.state,
				replyToMessageId: userMessageId,
			};
		}

		isLoading.value = false;
	};

	const handleSubmit = async () => {
		await sendMessage();
	};

	const resetApplicationState = () => {
		selectedModel.value = DEFAULT_MODEL;
		errorSimulationEnabled.value = false;
		themeMode.value = 'light';
		reducedMotionEnabled.value = false;
		responseDelay.value = DEFAULT_RESPONSE_DELAY;
		clearConversation();
	};

	return {
		prompt,
		isLoading,
		selectedModel,
		errorSimulationEnabled,
		themeMode,
		reducedMotionEnabled,
		responseDelay,
		messages,
		isSendDisabled,
		clearConversation,
		retryMessage,
		sendMessage,
		handleSubmit,
		resetApplicationState,
	};
};
