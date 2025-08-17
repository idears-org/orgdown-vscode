# Collaboration Instructions

This document outlines the rules and guidelines for the AI assistant working on the Orgdown project. The AI MUST adhere to these instructions at all times.

## 1. Core Mission

Our primary objective is to **implement 80% or more of the features of Emacs' Org Mode within a VS Code extension**. All actions and suggestions by the AI must serve this goal.

## 2. Collaboration Model

- **Final Authority**: The human developer makes all final decisions.
- **Proactivity**: The AI is encouraged to be proactive: suggest improvements, identify potential issues, and propose refactorings in line with the established architecture.
- **Clarity**: All communication and proposals must be clear, concise, and state both the *what* and the *why*.

## 3. The Development Canon

This project follows a strict, documentation-driven workflow. The AI must understand and adhere to the roles of the key documents.

- **The "How" - `docs/contributing/readme.org`**: This is the single source of truth for the development process. All contributions, from a simple bug fix to a new feature, MUST follow the multi-layered testing workflow defined here.

- **The "Why" - Architecture Decision Records (ADRs)**: For any significant architectural decision, an ADR must be created in `docs/architecture_decisions/`. Before proposing a change, the AI MUST review existing ADRs for relevant precedents and principles.

- **The "What" - Feature & Implementation Plans**: For any new feature, a planning or specification document should be created in `docs/reference/feature_specs` or `docs/reference/implementation-plans/`. The AI MUST consult these documents to understand the scope and requirements of a task.

## 4. Coding & Project Standards

- **TypeScript**: All code MUST adhere to the rules defined in `eslint.config.mjs` and the `tsconfig.*.json` family of files.
- **Commit Messages**: All commit messages MUST follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.
- **File Naming**: All files MUST adhere to the conventions outlined in the development guide.

## 5. Testing Requirements

- **The Testing Pyramid**: Every new feature MUST be accompanied by meaningful tests at all applicable layers (L1 Unit, L2 Manual, L3 Snapshot), as defined in the development guide.
- **The Fixture Format**: All tests MUST use the official, headline-based V7 fixture format.
- **Regression Tests**: Every bug fix MUST include a regression test that would have failed before the fix.

## 6. Contextual Awareness: The Sources of Truth

To gain a complete understanding of any task, the AI **MUST** begin by loading and synthesizing information from the following sources of truth:

1. **The Development Guide (`docs/contributing/readme.org`)**: To understand the required process.
2. **Relevant ADRs (`docs/architecture_decisions/*.org`)**: To understand the architectural principles that govern the task.
3. **Relevant Plans (`docs/reference/feature_specs/*.org`, `docs/reference/implementation-plans/*.org`)**: To understand the specific goals and requirements of the feature.
4. **The Core Logic (`common/src/grammar/regex.ts`)**: To understand the existing regular expression patterns.
6. **The Core Structure (`syntaxes/org.tmLanguage.template.yaml`, `common/src/scoping.ts`)**: To understand how logic is mapped to grammar scopes.
7. **Existing Test Cases (`test/fixtures/*.org`)**: To find examples of how similar features are currently tested.
