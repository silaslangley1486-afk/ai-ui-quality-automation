import { computed, ref } from 'vue';
import { Message, WELCOME_MESSAGE } from '../types/chat';
import { getMockResponse } from '../services/mockAssistant';

export const useChat = () => {
	const prompt = ref('');
	const isLoading = ref(false);
	const selectedModel = ref('model-v1');
	const errorSimulationEnabled = ref(false);
	const messages = ref<Message[]>([WELCOME_MESSAGE]);

	const isSendDisabled = computed(
		() => isLoading.value || prompt.value.trim().length === 0,
	);

	const clearConversation = () => {
		messages.value = [WELCOME_MESSAGE];
		prompt.value = '';
	};

	const retryMessage = async (messageId: string) => {
		const errorMessageIndex = messages.value.findIndex(
			(message) => message.id === messageId
		);

		if (errorMessageIndex === -1) return;

		const errorMessage = messages.value[errorMessageIndex];
		const userMessageId = errorMessage.replyToMessageId;

		if (!userMessageId) return;

		const userMessage = messages.value.find(
			(message) => message.id === userMessageId
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
			state: 'success',
			replyToMessageId: userMessageId,
		});

		await new Promise((resolve) => setTimeout(resolve, 600));

		const responseContent = getMockResponse(userContent);

		const loadingIndex = messages.value.findIndex(
			(message) => message.id === loadingMessageId
		);

		if (loadingIndex !== -1) {
			messages.value[loadingIndex].content = responseContent;
		}

		isLoading.value = false;
	};

	const sendMessage = async () => {
		const content = prompt.value.trim();

		if (!content) return;

		const userMessageId = `user-${Date.now()}`;

		messages.value.push({
			id: userMessageId,
			role: 'user',
			content,
		});

		prompt.value = '';
		isLoading.value = true;

		await new Promise((resolve) => setTimeout(resolve, 600));

		if (errorSimulationEnabled.value) {
			messages.value.push({
				id: `assistant-${Date.now()}`,
				role: 'assistant',
				content: `Error: The assistant encountered an issue processing your request. (Model: ${selectedModel.value})`,
				state: 'error',
				replyToMessageId: userMessageId,
			});
		} else {
			const responseContent = getMockResponse(content);

			messages.value.push({
				id: `assistant-${Date.now()}`,
				role: 'assistant',
				content: responseContent,
				state: 'success',
				replyToMessageId: userMessageId,
			});
		}

		isLoading.value = false;
	};

	const handleSubmit = async () => {
		await sendMessage();
	};

	return {
		prompt,
		isLoading,
		selectedModel,
		errorSimulationEnabled,
		messages,
		isSendDisabled,
		clearConversation,
		retryMessage,
		sendMessage,
		handleSubmit,
	};
};
