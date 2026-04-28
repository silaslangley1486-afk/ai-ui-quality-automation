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
    </header>

    <section class="conversation" aria-labelledby="conversation-title">
      <div class="section-heading">
        <h2 id="conversation-title">Conversation</h2>
        <p class="section-note">User messages and assistant replies appear here.</p>
      </div>22

      <div role="log" aria-live="polite">
        <ul class="conversation-list">
          <li
            v-for="message in messages"
            :key="message.id"
            :class="['message', message.role]"
            :aria-label="message.role === 'assistant' ? 'Assistant message' : 'User message'"
          >
            <div class="message-meta">
              <span class="message-role">
                {{ message.role === 'assistant' ? 'Assistant' : 'You' }}
              </span>
            </div>
            <p>{{ message.content }}</p>
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

    type Message = {
        id: string;
        role: MessageRole;
        content: string;
    };

    const prompt = ref('');
    const isLoading = ref(false);
    const messages = ref<Message[]>([
        {
            id: 'assistant-welcome',
            role: 'assistant',
            content: 'Hello! I am a general AI assistant. Ask me anything and I will reply with a sample response.',
        },
    ]);

    const isSendDisabled = computed(
        () => isLoading.value || prompt.value.trim().length === 0,
    );

    const sendMessage = async () => {
        const content = prompt.value.trim();

        if (!content) return;

        messages.value.push({
            id: `user-${Date.now()}`,
            role: 'user',
            content,
        });

        prompt.value = '';
        isLoading.value = true;

        await new Promise((resolve) => setTimeout(resolve, 600));

        messages.value.push({
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: `Mock response: I received your prompt and I am generating a sample assistant reply for "${content}".`,
        });

        isLoading.value = false;
    };

    const handleSubmit = async () => {
        await sendMessage();
    };
</script>
