<template>
  <main class="app-shell">
    <header class="hero">
      <div>
        <p class="eyebrow">AI Assistant Mock</p>
        <h1>AI UI Quality Automation</h1>
        <p class="description">
          A controlled test target for Playwright and accessibility testing. Send a prompt and review the conversation below.
        </p>
      </div>

      <div class="header-controls">
        <div class="control-group">
          <label for="model-select">Model:</label>
          <select id="model-select" class="model-select" v-model="selectedModel">
            <option value="model-v1">Model V1</option>
            <option value="model-v2">Model V2</option>
            <option value="model-v3">Model V3</option>
          </select>
        </div>

        <label class="error-toggle">
          <input type="checkbox" v-model="errorSimulationEnabled" />
          Enable error simulation
        </label>

        <button class="clear-button" type="button" @click="clearConversation">
          Clear conversation
        </button>
      </div>
    </header>

    <section class="conversation" aria-labelledby="conversation-title">
      <div class="section-heading">
        <h2 id="conversation-title">Conversation</h2>
        <p class="section-note">User messages and assistant replies appear here.</p>
      </div>

      <div role="log" aria-live="polite" aria-label="Conversation history">
        <ul class="conversation-list" data-testid="message-list">
          <li
            v-for="message in messages"
            :key="message.id"
            :class="['message', message.role, message.state]"
            :aria-label="message.role === 'assistant' ? 'Assistant message' : 'User message'"
            :data-testid="message.role === 'assistant' ? 'assistant-message' : 'user-message'"
          >
            <div class="message-meta">
              <span class="message-role">
                {{ message.role === 'assistant' ? 'Assistant' : 'You' }}
              </span>

              <span v-if="message.state === 'error'" class="message-state">Error</span>
            </div>

            <p>{{ message.content }}</p>

            <button
              v-if="message.state === 'error'"
              type="button"
              class="retry-button"
              @click="retryMessage(message.id)"
            >
              Retry
            </button>
          </li>
        </ul>
      </div>
    </section>

    <form class="composer" @submit.prevent="handleSubmit">
      <label class="composer-label" for="prompt-input">Send a prompt</label>

      <textarea
        id="prompt-input"
        v-model="prompt"
        placeholder="Type your prompt here..."
        rows="4"
        :disabled="isLoading"
      />

      <div class="composer-actions">
        <button type="submit" class="send-button" :disabled="isSendDisabled">
          {{ isLoading ? 'Sending…' : 'Send' }}
        </button>
      </div>
    </form>
  </main>
</template>

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    type MessageRole = 'user' | 'assistant';
    type MessageState = 'success' | 'error';

    type Message = {
        id: string;
        role: MessageRole;
        content: string;
        state?: MessageState;
        replyToMessageId?: string;
    };

    const prompt = ref('');
    const isLoading = ref(false);
    const selectedModel = ref('model-v1');
    const errorSimulationEnabled = ref(false);
    const messages = ref<Message[]>([
        {
            id: 'assistant-welcome',
            role: 'assistant',
            content: 'Hello! I am a general AI assistant. Ask me anything and I will reply with a sample response.',
            state: 'success',
        },
    ]);

    const isSendDisabled = computed(
        () => isLoading.value || prompt.value.trim().length === 0,
    );

    const getMockResponse = (userPrompt: string): string => {
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

    const clearConversation = () => {
        messages.value = [
            {
                id: 'assistant-welcome',
                role: 'assistant',
                content: 'Hello! I am a general AI assistant. Ask me anything and I will reply with a sample response.',
                state: 'success',
            },
        ];
        prompt.value = '';
    };

    const retryMessage = async (messageId: string) => {
        const errorMessageIndex = messages.value.findIndex(message => message.id === messageId);

        if (errorMessageIndex === -1) return;

        const errorMessage = messages.value[errorMessageIndex];
        const userMessageId = errorMessage.replyToMessageId;

        if (!userMessageId) return;

        const userMessage = messages.value.find(message => message.id === userMessageId);

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
        const loadingIndex = messages.value.findIndex(message => message.id === loadingMessageId);

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
</script>
