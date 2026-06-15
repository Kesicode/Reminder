# Information Architecture (IA)

## Sitemap / Route Structure

```text
/ (Marketing Home / Landing)
/login
/register
/forgot-password

(Protected Routes - App Router Dashboard Layout)
/dashboard
    /today
    /upcoming
    /completed
    /overdue

/calendar
    /calendar/[year]/[month]

/groups
    /groups/create
    /groups/[groupId]
        /groups/[groupId]/reminders
        /groups/[groupId]/members
        /groups/[groupId]/settings (Owner/Admin only)

/settings
    /settings/profile
    /settings/preferences
    /settings/notifications

/admin (Super Admin only)
    /admin/users
    /admin/groups
    /admin/analytics
```

## Component Hierarchy (Key Pages)

### Dashboard (`/dashboard`)
- Layout
  - Sidebar Navigation
  - Top Header (Search, Notifications, Profile)
  - Main Content Area
    - Stats Widget Row (Total, Pending, etc.)
    - Quick Add Form Component
    - Reminder List (Filtered by route state: Today/Upcoming)
      - Reminder Card
        - Checkbox
        - Title & Description
        - Metadata (Date, Time, Priority Badge)

### Group Detail (`/groups/[groupId]`)
- Group Header (Title, description, member count)
- Tabs (Reminders, Members, Activity)
- Tab Content: Reminders
  - Filter / Sort bar
  - Shared Reminder List
    - Shared Reminder Card (includes Assigned To avatar)
- Tab Content: Members
  - Member List Table (Role dropdowns for Admins/Owners)
