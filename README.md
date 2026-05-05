# AI UI Quality Automation Portfolio

A mock AI assistant web application built as a controlled test target for demonstrating modern quality engineering practices. This project focuses on automated UI testing, accessibility validation, and maintainable test architecture for AI-style user interfaces.

## Why This Project Exists

As AI-powered products become more common, quality assurance requires more than basic UI checks. Teams need reliable testing for dynamic interfaces, asynchronous states, accessibility, and critical user workflows.

This portfolio project was created to demonstrate practical skills in:

- End-to-end test automation with Playwright
- Accessibility testing with axe-core
- Keyboard navigation and focus management validation
- Error-state and retry-flow testing
- Risk-based test coverage for AI-style interfaces
- CI execution with GitHub Actions
- Clean, maintainable test design

## Tech Stack

- Vue 3
- TypeScript
- Vite
- Playwright
- axe-core
- GitHub Actions

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Build the app for production:

```bash
npm run build
```

## Project Scope

The application uses deterministic mocked responses and does not connect to a real AI model or external API. The primary purpose of the repository is to showcase testing strategy, automation quality, and accessibility coverage in a realistic AI UI scenario.

## Locator Strategy

This project follows a deliberate locator strategy aligned with accessibility and test reliability best practices. In several cases, both role-based and test ID locators are demonstrated to show how different strategies apply depending on the testing goal (user interaction vs UI state verification).

**Primary approach: Role-based locators**

* Tests use `getByRole`, `getByLabelText`, and other accessible queries whenever possible
* This ensures tests reflect real user interactions and validates accessible names and roles

**Supplementary approach: `data-testid`**

* Used selectively for non-semantic or highly dynamic UI elements (e.g., chat message lists, loading states)
* Avoids brittle selectors in repeated structures where accessible roles/names are not unique

**Principle**

> Prefer user-centric selectors. Use test IDs only when necessary to verify UI state or dynamic content that lacks stable semantic meaning.

## Mock Assistant

The mock assistant supports deterministic test scenarios via [test:<scenario>] prompts (e.g., [test:empty], [test:long], [test:unsupported]). This allows Playwright tests to validate AI UI behavior without relying on nondeterministic model output.

Long responses are intentionally included to test scrolling behavior, layout resilience, and readability of extended AI-generated content.