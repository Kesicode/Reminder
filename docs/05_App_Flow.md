# App Flow Documentation

This document describes the high-level application flow and state transitions for RemindSync.

## 1. Initial Load & Auth State
- When the user visits `/`, the Next.js middleware checks for a valid session cookie.
- If no session, redirect to `/login`.
- If a session exists, the App Router serves the `(dashboard)` layout.
- The client-side Firebase Auth SDK initializes. The Zustand store hydrates the `user` state.

## 2. Dashboard Navigation
- The main layout includes a persistent **Sidebar** (left) and **Header** (top).
- **Sidebar Links**:
  - Dashboard `/`
  - Calendar `/calendar`
  - My Groups `/groups`
  - Admin Panel `/admin` (visible only if Super Admin claim exists)
- **Header**:
  - Global Search (quick find reminders)
  - Notification Bell (opens Drawer)
  - User Avatar Profile Dropdown (Settings, Logout)

## 3. Creating a Reminder (Anywhere)
- User clicks "Add Reminder" (button in Header or Dashboard).
- A global Modal overlay opens.
- User fills the form.
- Upon submission, optimistic UI update is applied to the local Zustand store.
- Background mutation writes to Firestore.
- If successful, modal closes, and toast notification "Reminder added" appears.
- If failed, Zustand store rolls back, error toast is displayed.

## 4. Group Context Switching
- When navigating to `/groups/[groupId]`, the application context switches to that specific group.
- The Sidebar highlights the active group.
- The main view displays the Group Dashboard, which aggregates reminders, activity feed, and members specifically for that group.
- Any new reminder created while in this context defaults to a "Group Reminder".

## 5. Notification Handling
- **Foreground**: If the app is open when a FCM push arrives, a Toast is triggered and the notification bell badge increments.
- **Background**: If the app is closed, the OS displays a web push notification. Clicking it opens the app to the relevant context (e.g., specific group or reminder).
