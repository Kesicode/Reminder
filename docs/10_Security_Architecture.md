# Security Architecture

## 1. Authentication & Authorization
- **Authentication**: Managed exclusively by Firebase Authentication. JWT tokens are verified on all server-side requests.
- **Authorization (RBAC)**:
  - Firebase Custom Claims will be used for global roles (e.g., `superAdmin: true`).
  - Firestore Security Rules will govern row-level access based on `uid` and `groupId`.

## 2. Firestore Security Rules
All queries from the frontend must pass these rules. We will never trust frontend role checks.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() { return request.auth != null; }
    function isOwner(uid) { return request.auth.uid == uid; }
    function isSuperAdmin() { return request.auth.token.superAdmin == true; }
    
    function getGroupRole(groupId) {
      return get(/databases/$(database)/documents/groupMembers/$(groupId + '_' + request.auth.uid)).data.role;
    }
    function isGroupMember(groupId) {
      return getGroupRole(groupId) in ['owner', 'admin', 'member'];
    }
    function isGroupAdmin(groupId) {
      return getGroupRole(groupId) in ['owner', 'admin'];
    }

    // USERS collection
    match /users/{userId} {
      // Users can read/write their own profile. Super Admins can read all.
      allow read: if isAuthenticated() && (isOwner(userId) || isSuperAdmin());
      allow write: if isAuthenticated() && isOwner(userId);
    }

    // REMINDERS collection
    match /reminders/{reminderId} {
      allow read: if isAuthenticated() && (
        isOwner(resource.data.ownerId) || 
        (
          resource.data.groupId != null && 
          isGroupMember(resource.data.groupId) &&
          (resource.data.visibilityRestriction == false || resource.data.assignedTo == request.auth.uid || isGroupAdmin(resource.data.groupId))
        ) || isSuperAdmin()
      );
      
      allow create: if isAuthenticated() && (
        request.resource.data.ownerId == request.auth.uid &&
        (request.resource.data.groupId == null || isGroupMember(request.resource.data.groupId))
      );
      
      allow update, delete: if isAuthenticated() && (
        isOwner(resource.data.ownerId) || 
        (resource.data.groupId != null && isGroupAdmin(resource.data.groupId)) ||
        (resource.data.assignedTo == request.auth.uid && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status', 'completedAt', 'updatedAt']))
      );
    }
    
    // Additional rules for groups, members, notifications omitted for brevity but follow the same strict patterns.
  }
}
```

## 3. Application Security
- **Firebase App Check**: Enforced using reCAPTCHA Enterprise for web clients to ensure only the authentic RemindSync frontend can access backend resources.
- **Input Validation**: `zod` schemas used extensively to validate all incoming data both on the client (UX) and in Cloud Functions/Server Actions (Security).
- **XSS & CSRF**: Handled automatically by Next.js React mechanisms and Firebase Auth session cookies.
- **Rate Limiting**: Cloud Functions will implement IP-based or UID-based rate limiting for sensitive actions (e.g., sending invites).
