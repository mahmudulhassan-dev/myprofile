# Contact Form System Documentation

## Overview
The Contact Form System includes a public submission API with file uploads and an Admin Panel interface for managing inquiries. It features:
- **Rate Limiting**: 5 requests per 10 minutes per IP.
- **File Uploads**: Supports .jpg, .png, .pdf, .doc, .zip (Max 10MB).
- **Admin Inbox**: Search, filter, bulk delete, and export (CSV).
- **Notifications**: Email notifications to admin and auto-replies (configured via `emailService`).

## Environment Variables
Ensure these are set in `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=myprofile_db
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=your_admin_email@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user
SMTP_PASS=pass
```

## API Extensions
### 1. Submit Contact Form
**POST** `/api/contact/submit`
- **Body** (multipart/form-data):
  - `full_name`: String (Required)
  - `email`: String (Required, Valid Email)
  - `subject`: String (Required)
  - `message`: String (Required)
  - `project_type`: String (Enum: Website, App, Design, etc.)
  - `budget_range`: String
  - `attachment`: File (Optional)

**cURL Example:**
```bash
curl -X POST "http://localhost:5000/api/contact/submit" \
  -H "Content-Type: multipart/form-data" \
  -F "full_name=Test User" \
  -F "email=test@example.com" \
  -F "subject=Inquiry" \
  -F "message=Hello world" \
  -F "project_type=Website" \
  -F "budget_range=$1000+" \
  -F "attachment=@/path/to/file.pdf"
```

### 2. Admin APIs (Protected)
Headers: `Authorization: Bearer <token>`

- **GET /api/admin/contacts**: List contacts (with `page`, `limit`, `status`, `search`).
- **POST /api/admin/contacts/bulk-delete**: Delete multiple. Body: `{ "ids": [1, 2] }`.
- **GET /api/admin/contacts/export**: Download CSV.

## Testing
Run the integration test script:
```bash
node tests/contact_integration_test.js
```
(Ensure server is running on port 5000)

## Running the Project
1. **Backend**: `npm run dev:full` (Runs Node + Vite)
2. **Frontend**: Access via `http://localhost:5173`
3. **Admin Panel**: Login -> Messages Tab.

## Database Seeding
To populate dummy data:
```bash
node scripts/seed_contacts.js
```
