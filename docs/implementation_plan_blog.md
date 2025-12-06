# Blog Management System - Implementation Plan

## Overview
A comprehensive, professional-grade blog system integrated into the Admin Panel. Features include rich text editing, draft/schedule workflow, categories, tags, SEO tools, and analytics.

## 1. Database Schema
New Models needed in `server/models/index.js`:
- **BlogPost**: `title`, `slug`, `content` (HTML/Markdown), `excerpt`, `featured_image`, `status` (draft/published/archived), `published_at`, `author_id`, `views`, `read_time`, `seo_title`, `seo_desc`, `seo_keywords`.
- **Category**: `name`, `slug`, `description`, `icon`, `color`.
- **Tag**: `name`, `slug`, `color`.
- **PostTag**: Junction table.
- **Comment**: `post_id`, `author_name`, `author_email`, `content`, `status` (approved/pending/spam), `parent_id`.

## 2. Backend API
Base URL: `/api/admin/blog`

### Endpoints
- **Posts**:
    - `GET /posts` (List with filters/pagination)
    - `GET /posts/:id` (Get single)
    - `POST /posts` (Create)
    - `PUT /posts/:id` (Update)
    - `DELETE /posts/:id` (Delete)
    - `POST /posts/bulk` (Bulk actions)
- **Categories/Tags**:
    - `GET /categories` / `POST /categories` ...
    - `GET /tags` / `POST /tags`
- **Analytics**:
    - `GET /analytics` (Views, top posts, traffic)

## 3. Frontend Modules `src/components/admin/blog/`
- **BlogManager.jsx**: Main entry, tabs for Dashboard, Posts, Categories, Tags.
- **BlogDashboard.jsx**: Analytics overview (Charts, Counters).
- **PostList.jsx**: Data table with bulk actions.
- **PostEditor.jsx**: The core interface.
    - **Editor**: WYSIWYG (TipTap or ReactQuill) + Markdown support.
    - **Sidebar**: Status, Categories, Tags, Featured Image, SEO panel.
- **CategoryManager.jsx**: Category CRUD.
- **TagManager.jsx**: Tag CRUD.
- **CommentManager.jsx**: Moderation queue.

## 4. Dependencies
- `tiptap` or `react-quill` for Rich Text.
- `slugify` for auto-slugs.
- `react-dropzone` for media.

## 5. Phased Execution
1.  **Phase 1: Foundation**: Database Models & API Routes.
2.  **Phase 2: Editor**: `PostEditor` component.
3.  **Phase 3: Management**: List view, Categories, Tags.
4.  **Phase 4: Advanced**: SEO, Analytics, Comments.
