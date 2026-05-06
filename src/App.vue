<template>
	<div class="app">
		<a href="#main-content" class="skip-link">Skip to main content</a>

		<header class="page-header">
			<div class="page-header-content">
				<h1>AI UI Quality Automation</h1>
				<p class="page-description">
					A mock AI assistant built as a controlled target for Playwright and accessibility testing. Interact with the assistant below to test UI interactions and accessibility compliance.
				</p>
			</div>
		</header>

		<main id="main-content" class="app-shell" tabindex="-1">
			<ChatInterface />
		</main>
	</div>
</template>

<script lang="ts" setup>
	import ChatInterface from './components/ChatInterface.vue';
</script>

<style scoped>
	.app {
		height: 100%;
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		padding: 24px;
		overflow: hidden;
	}

	.skip-link {
		position: absolute;
		top: -40px;
		left: 6px;
		background: #4338ca;
		color: white;
		padding: 8px;
		text-decoration: none;
		border-radius: 4px;
		z-index: 1000;
	}

	.skip-link:focus {
		top: 6px;
	}

	.page-header {
		padding: 25px;
		border-radius: 24px;
		background: #ffffff;
		border: 1px solid #e5e7eb;
		box-shadow: 0 18px 45px rgba(15, 23, 42, 0.05);
		margin: 0 auto 16px auto;
		max-width: 920px;
		width: 100%;
	}

	.page-header-content {
		max-width: 920px;
		margin: 0 auto;
	}

	.page-header h1 {
		font-size: clamp(1.6rem, 2vw, 2rem);
		margin-bottom: 16px;
		line-height: 1.1;
	}

	.page-description {
		max-width: 700px;
		color: #4b5563;
	}

	.app-shell {
		max-width: 920px;
		min-height: 0;
		margin: 0 auto;
		display: grid;
		gap: 28px;
		width: 100%;
	}
	
	.app-shell:focus {
		outline: none;
	}

	@media (max-width: 640px) {
		.app {
			padding: 12px;
		}
	}
</style>
