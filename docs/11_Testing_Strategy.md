# Testing Strategy

## 1. Unit Testing
- **Frameworks**: Vitest and React Testing Library.
- **Scope**:
  - Utility functions (e.g., date parsing, priority color mapping).
  - React Hooks (e.g., `useReminders` logic, custom form hooks).
  - Reusable UI Components (e.g., Buttons, Inputs, Modal dialogs) to ensure they render correctly and emit events appropriately.
- **Goal**: >80% code coverage for core business logic and shared UI components.

## 2. Integration Testing
- **Frameworks**: Vitest + Firebase Local Emulator Suite.
- **Scope**:
  - Test interactions between Next.js APIs / Server Actions and the Firestore Database.
  - Verify Firestore Security Rules (e.g., asserting that an Admin can write to a group reminder, but a Member from another group cannot).
  - Test Cloud Functions logic locally.

## 3. End-to-End (E2E) Testing
- **Framework**: Playwright.
- **Scope**:
  - Critical user journeys:
    1. Sign up, Login, Logout.
    2. Create, Edit, Complete a personal reminder.
    3. Create a group, invite a user, accept an invite.
    4. Assign a shared reminder to a group member and verify it appears on their dashboard.
- **Execution**: E2E tests run in the CI pipeline against a dedicated staging Firebase project before production deployment.

## 4. Performance & Security Testing
- **Performance**: Use Lighthouse CI to ensure page load times, accessibility, and SEO metrics remain optimal.
- **Security**: Regular audits using `npm audit` and Firebase Security Rules emulator tests to catch regressions.
