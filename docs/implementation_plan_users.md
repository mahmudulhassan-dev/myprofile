# User Management System Implementation Plan

## Goal
Implement a comprehensive, enterprise-grade User Management System with RBAC (Role-Based Access Control), extensive logging, and security features.

## Proposed Changes

### Database Schema (Server)
`server/models/index.js` will be updated to include/enhance:

1.  **User Model** (Enhanced)
    *   Add `phone`, `bio`, `social_links`, `skills`, `last_login`, `is_verified`, `two_factor_enabled`.
    *   Relation: `User.belongsTo(Role)`

2.  **Role Model** (New)
    *   fields: `name`, `slug`, `description`, `color`.
    *   Relation: `Role.hasMany(User)`, `Role.belongsToMany(Permission)`

3.  **Permission Model** (New)
    *   fields: `name`, `slug`, `module`, `description`.
    *   Relation: `Permission.belongsToMany(Role)`

4.  **ActivityLog Model** (Enhanced)
    *   Add `user_id` relation.

#### [MODIFY] server/models/index.js

### Backend API (Server)

1.  **Middleware** (`server/middleware/authMiddleware.js`)
    *   `authenticate`: Verify JWT/Session.
    *   `authorize(permission)`: Check if user's role has permission.

2.  **Controllers**
    *   `server/controllers/userController.js`: CRUD Users, Status, Profile Update.
    *   `server/controllers/roleController.js`: CRUD Roles, Assign Permissions.
    *   `server/controllers/authController.js`: (Review existing or create) Login, 2FA, Password Reset.

3.  **Routes**
    *   `server/routes/userRoutes.js`: User & Role Management endpoints.

### Frontend (React)

1.  **User Manager** (`src/components/admin/users/UsersManager.jsx`)
    *   Main container with tabs: Users, Roles, Activity Logs.

2.  **User List** (`src/components/admin/users/UserList.jsx`)
    *   Table view with filters, search, and bulk actions.

3.  **User Editor** (`src/components/admin/users/UserEditor.jsx`)
    *   Modal/Page for adding/editing users.

4.  **Role Manager** (`src/components/admin/users/RoleManager.jsx`)
    *   Interface to manage roles and toggle permissions.

## Verification Plan

### Automated Tests
*   Run unit tests for API endpoints (if testing framework available).
*   Test specific permission scenarios manually via Postman or Browser.

### Manual Verification
1.  **User Creation**: Create users with different roles.
2.  **RBAC Check**: Login as "Editor" and verify they cannot access "Admin" only routes.
3.  **Logs**: Perform actions and verify `ActivityLog` entries.
4.  **Security**: Test invalid logins and permission denials.
