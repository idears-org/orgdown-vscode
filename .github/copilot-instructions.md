# GitHub Copilot - Collaboration Instructions

This document outlines the rules and guidelines for the AI assistant (GitHub Copilot) working on the Orgdown project. The AI MUST adhere to these instructions at all times.

## 1. Core Mission

Our primary objective is to **implement 80% or more of the features of Emacs' Org Mode within a VS Code extension**. All actions and suggestions by the AI must serve this goal.

## 2. Collaboration Model

### Decision Making

- The AI is responsible for analyzing problems, proposing solutions with their respective pros and cons, and offering a recommendation.
- The human developer makes the final decision.

### Proactivity

- The AI is encouraged to be proactive: suggest improvements, identify potential issues (e.g., in code, logic, or workflow), and propose refactorings.
- When a task is completed, the AI should suggest logical next steps.

### Communication

- Communication should be clear, concise, and professional.
- When proposing a change, the AI must clearly state the **what** and the **why**.

## 3. Development Workflow

We MUST strictly follow the workflows defined in our project documentation (`docs/`).

- **ADR Workflow**: For any significant architectural or technical decision, we MUST consider creating an Architecture Decision Record (ADR). The AI should prompt the human developer when a decision might warrant an ADR.
- **Feature Workflow**: All new features **MUST** begin with a Feature Specification document, based on the template in `docs/features/`. No implementation should start before the specification is approved by the human developer.
- **Project Overview**: For every new feature, a high-level description **MUST** be added to the `Key Features` section in `docs/PROJECT_OVERVIEW.org`. This ensures the AI maintains a holistic view of the project.

## 4. Coding Standards

- All TypeScript/JavaScript code **MUST** adhere to the rules defined in `eslint.config.mjs` and `tsconfig.json`.
- Code should be self-documenting where possible. Comments should explain the "why," not the "what."

## 5. Commit Message Conventions

- All commit messages **SHOULD** follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.
- This helps in automating changelog generation and provides a clear, browsable project history.
- Examples:
    - `feat: implement headline folding`
    - `fix: correct off-by-one error in parser`
    - `docs: update feature specification for tables`
    - `refactor: simplify state management logic`

## 6. File Naming Conventions

To ensure consistency and predictability across the project, all files MUST adhere to the following naming conventions:

- **Source Code (`.ts`)**: Use `kebab-case`.
  - Example: `headline-parser.ts`
- **Test Files (`.test.ts`)**: Use the name of the source file, suffixed with `.test`.
  - Example: `headline-parser.test.ts`
- **Documentation (`.org`)**:
  - **ADRs**: Use the format `[NNN]-short-title-in-kebab-case.org`.
    - Example: `001-choice-of-documentation-format.org`
  - **Feature Specs**: Use the format `[NNN]-feature-name-in-kebab-case.org`.
    - Example: `001-headline-folding.org`
  - **General Docs**: Use `kebab-case`.
    - Example: `project-overview.org`, `development-workflow.org`
- **Configuration Files**: Adhere to established community standards.
  - Example: `package.json`, `tsconfig.json`, `esbuild.js`

## 7. Testing Requirements

- Every new feature **MUST** be accompanied by meaningful tests.
- Every bug fix **MUST** include a regression test that would have failed before the fix.
- The project should maintain a high level of test coverage. The AI should point out any new code that is not adequately tested.

## 8. Contextual Awareness

- When working on a specific feature, the AI **MUST** load and consider all relevant documentation from the `docs/` directory. This includes, but is not limited to:
  - The feature's corresponding specification document in `docs/features/`.
  - Any relevant ADRs from `docs/adr/`.
  - The `docs/project-overview.org` to understand how the feature fits into the larger project.
