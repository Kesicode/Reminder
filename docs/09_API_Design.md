# API Design Specification

## Overview
RemindSync interacts with backend services through three primary mechanisms:
1. **Direct Firestore SDK**: For real-time reads and simple CRUD where security rules suffice.
2. **Next.js API Routes (Server Actions)**: For secure server-side logic and third-party integrations.
3. **Firebase Cloud Functions**: For event-driven background tasks and administrative functions.

## 1. Firebase Cloud Functions (v2)

### Triggered Functions (Event-Driven)
- `onUserCreate(auth.user)`: Creates a corresponding user document in Firestore `users` collection.
- `onReminderUpdate(firestore.document)`:
  - If status changes to completed, logs to `activityLogs`.
  - Checks recurrence rules. If a recurring reminder is completed, it generates the next instance.
- `onReminderAssigned(firestore.document)`:
  - Triggered when a reminder is created/updated with a new `assignedTo` value.
  - Creates a document in `notifications` for the assignee.
- `onMemberInvited(firestore.document)`:
  - Triggered when an `invitations` doc is created.
  - Sends an email via SendGrid/Firebase Mail extension.
- `checkDueReminders(scheduler)`:
  - Runs every 15 minutes.
  - Queries `reminders` due within the next 30 mins.
  - Generates `notifications` and pushes FCM payloads.

### Callable Functions (HTTPS Callable)
- `getAdminStats(data, context)`:
  - Returns aggregated stats for the Super Admin panel.
  - Validates `context.auth.token.superAdmin === true`.
- `disableUser(data, context)`:
  - Disables Auth account and flags user doc. Super Admin only.
- `deleteGroup(data, context)`:
  - Deletes group, subcollections, and associated reminders. Only Group Owner or Super Admin can call this.

## 2. Next.js Server Actions

We will utilize Next.js Server Actions for form submissions that require server-side validation or shouldn't expose complex logic on the client.

- `inviteUserToGroup(email: string, groupId: string)`
  - Validates caller is Admin/Owner.
  - Creates invitation doc.
- `updateProfile(data: ProfileData)`
  - Updates user document.
- `promoteMember(userId: string, groupId: string, newRole: Role)`
  - Validates caller is Owner.
  - Updates `groupMembers` doc.

## 3. Real-time Subscriptions (Client)

- `useReminders()`: Subscribes to `reminders` where `ownerId == uid` OR `groupId IN myGroups`.
- `useNotifications()`: Subscribes to `notifications` where `userId == uid` and `read == false`.
