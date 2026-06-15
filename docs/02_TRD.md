# Technical Requirements Document (TRD)

## 1. System Architecture
RemindSync uses a modern, serverless architecture based on Next.js and Firebase.

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **State Management**: Zustand (Global state, UI state)
- **Styling**: Tailwind CSS, Framer Motion (for animations)
- **Forms & Validation**: React Hook Form with Zod resolvers
- **Icons**: Lucide React

### Backend (BaaS)
- **Authentication**: Firebase Authentication
- **Database**: Cloud Firestore (NoSQL Document Store)
- **Serverless Functions**: Firebase Cloud Functions v2 (Node.js/TypeScript)
- **Notifications**: Firebase Cloud Messaging (FCM)
- **Security**: Firebase App Check (reCAPTCHA Enterprise / App Attest)
- **Hosting**: Firebase Hosting (Optimized for Next.js)

## 2. Infrastructure & Data Flow
- **Client to Firebase**: Direct connection via Firebase Web SDK for real-time Firestore listeners and Auth state changes.
- **Client to API**: Next.js API Routes / Server Actions will handle sensitive operations that shouldn't be executed directly on the client.
- **Background Tasks**: Cloud Functions triggered by Firestore document writes (e.g., sending a notification when a reminder is assigned).

## 3. Project Structure Principles
- **Feature-Based Organization**: Code organized by feature domains (e.g., `features/reminders`, `features/groups`) containing components, hooks, and services specific to that domain.
- **Shared Components**: `components/ui/` for generic, reusable UI elements (buttons, inputs, modals).
- **Type Safety**: Centralized `types/` directory mapping exactly to Firestore schemas and component props.

## 4. Performance Optimization
- **Data Fetching**: Use Server Components where possible for initial load. Use client-side Firestore listeners only where real-time updates are required.
- **Pagination**: Implement cursor-based pagination for history, activity feeds, and admin lists.
- **Bundle Size**: Dynamic imports for heavy components (e.g., Calendar view).

## 5. Security & Compliance
- **Role-Based Access Control (RBAC)**: Enforced via Firestore Security Rules and Firebase Auth Custom Claims.
- **App Check**: Prevent unauthorized API/DB access from non-verified clients.
- **Input Validation**: Zod validation on both the client (React Hook Form) and server (Cloud Functions / API Routes).
