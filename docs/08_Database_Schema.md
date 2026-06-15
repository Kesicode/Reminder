# Database Schema (Firestore)

## Overview
RemindSync uses Cloud Firestore, a NoSQL document database.

## Collections

### 1. `users`
- **Document ID**: `uid` (from Firebase Auth)
- **Fields**:
  - `email` (string)
  - `displayName` (string)
  - `avatarUrl` (string | null)
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)
  - `stats` (map): `{ total: number, completed: number, pending: number }`

### 2. `groups`
- **Document ID**: Auto-generated
- **Fields**:
  - `name` (string)
  - `description` (string)
  - `ownerId` (string, ref to user `uid`)
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)

### 3. `groupMembers` (Subcollection under `groups/{groupId}/members` OR Root Collection)
*Using a root collection allows easier querying of "all groups a user is in". We will use a root collection.*
- **Document ID**: `groupId_userId`
- **Fields**:
  - `groupId` (string)
  - `userId` (string)
  - `role` (string: "owner" | "admin" | "member")
  - `joinedAt` (timestamp)

### 4. `reminders`
- **Document ID**: Auto-generated
- **Fields**:
  - `title` (string)
  - `description` (string)
  - `dueDate` (timestamp | string YYYY-MM-DD)
  - `dueTime` (string HH:mm | null)
  - `priority` (string: "low" | "medium" | "high")
  - `status` (string: "pending" | "completed")
  - `recurrence` (string: "none" | "daily" | "weekly" | "monthly")
  - `ownerId` (string) // User who created it
  - `groupId` (string | null) // Null if personal
  - `assignedTo` (string | null) // User ID if shared and assigned
  - `visibilityRestriction` (boolean) // True if only visible to assignee+admins
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)
  - `completedAt` (timestamp | null)

### 5. `notifications`
- **Document ID**: Auto-generated
- **Fields**:
  - `userId` (string) // Recipient
  - `type` (string: "due" | "assigned" | "invite" | "activity")
  - `title` (string)
  - `body` (string)
  - `link` (string) // URL to navigate to
  - `read` (boolean)
  - `createdAt` (timestamp)

### 6. `activityLogs`
- **Document ID**: Auto-generated
- **Fields**:
  - `groupId` (string | null)
  - `userId` (string)
  - `action` (string: "created_reminder" | "completed_reminder" | "joined_group" etc.)
  - `details` (map)
  - `createdAt` (timestamp)

### 7. `invitations`
- **Document ID**: Auto-generated
- **Fields**:
  - `groupId` (string)
  - `email` (string) // Invitee email
  - `invitedBy` (string) // User ID
  - `status` (string: "pending" | "accepted" | "declined")
  - `createdAt` (timestamp)

## Indexes Required
- `reminders`: `ownerId` (ASC), `status` (ASC), `dueDate` (ASC)
- `reminders`: `groupId` (ASC), `status` (ASC), `dueDate` (ASC)
- `groupMembers`: `userId` (ASC), `role` (ASC)
- `notifications`: `userId` (ASC), `createdAt` (DESC)
