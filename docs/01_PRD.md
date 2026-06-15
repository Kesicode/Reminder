# Product Requirements Document (PRD)

## 1. Product Overview
**Product Name:** RemindSync
**Purpose:** A modern collaborative reminder platform where users can manage personal reminders and shared group reminders in real time.

**Core Scope:**
- Personal reminders management
- Shared group reminders management
- Real-time notifications
- Calendar view
- Super Admin panel

**Out of Scope:**
- Chat messaging
- Media/file uploads (Video, Audio, Images etc.)

## 2. User Roles & Permissions
- **Super Admin**: Full access to all platform data via the Admin Panel. Can disable users, delete groups, and view global analytics.
- **Group Owner**: Creator of a group. Has full control over the group, including deleting the group and managing member roles.
- **Group Admin**: Can invite/remove members and manage all reminders within a specific group.
- **Group Member**: Can create, complete, and view reminders within a group.
- **Standard User**: Can manage personal reminders and create new groups.

## 3. Key Features

### 3.1 Authentication
- Register, Login, Logout, Forgot Password, Email Verification.
- User Profile: Full Name, Email, Avatar URL, Joined Date, Reminder Statistics.

### 3.2 Personal Reminders
- CRUD operations for reminders.
- **Fields**: Title, Description, Due Date, Due Time, Priority (Low/Medium/High), Status, Recurrence (None, Daily, Weekly, Monthly).
- **Views**: Today, Upcoming, Completed, Overdue.

### 3.3 Groups
- Create, invite (via email), join, and leave groups.
- Role management.

### 3.4 Group Reminders
- Shared visibility and assignments to specific members.
- Tracking completion status and activity feed per group.
- **Visibility Modes**: Entire Group or Assigned Member + Admins only.

### 3.5 Notifications
- Types: Reminder Due, Upcoming, Assigned, Group Invitation, Group Activity.
- Push and Browser Notifications via FCM.
- Unread badge counts and Notification Center.

### 3.6 Calendar
- Month view displaying both personal and group reminders.
- Color-coded priorities.

### 3.7 Dashboard
- Aggregated statistics and widgets (Recent Activity, Quick Add).

## 4. Non-Functional Requirements
- **Real-Time Synchronization**: Changes to reminders and groups must reflect instantly across clients.
- **Performance**: Fast initial load via Server-Side Rendering (Next.js) and optimized Firestore queries.
- **Security**: Strict Firestore Security Rules ensuring users can only access authorized data.
