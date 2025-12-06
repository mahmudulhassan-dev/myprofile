# Advanced Profile Module Implementation Plan

## Goal
Build a complete, secure, fully-functional PROFILE MODULE for Admin Panel and Frontend, covering Basic Info, Socials, Media, Professional Details, SEO, and Settings.

## 1. Database Schema Expansion
We will upgrade the existing `Profile` model and add relational models for list-based data to support "unlimited" entries.

### core Models (`server/models/index.js`)

#### **Profile** (Core Table)
- **Identity**: `fullName`, `username`, `designation`, `title`, `shortBio`, `longBio`, `gender`, `dob`, `age` (virtual/calc), `nationality`.
- **Contact**: `email` (JSON for multiple), `phone` (JSON for multiple), `whatsapp`, `website`, `address` (JSON: street, city, state, country).
- **Media**: `avatar`, `cover_photo`, `resume_url`, `intro_video_url`, `promo_video_url`.
- **Stats**: `experience_years`, `completed_projects`, `happy_clients`, `ongoing_projects`.
- **Status**: `work_status` (Available/Busy), `is_visible` (Boolean), `verified_badge` (Boolean).
- **Settings**: `theme_color`, `font_family`, `layout_mode`, `dark_mode`, `maintenance_mode`, `maintenance_msg`.

#### **ProfileSocial** (One-to-Many)
- `platform` (Facebook, Twitter, etc.), `url`, `icon`, `order`.

#### **ProfileSkill** (One-to-Many)
- `name`, `percentage`, `color`, `category`.

#### **ProfileExperience** (One-to-Many)
- `company`, `designation`, `start_date`, `end_date`, `is_current`, `description`, `location`.

#### **ProfileEducation** (One-to-Many)
- `institution`, `degree`, `field`, `start_date`, `end_date`, `grade`.

#### **ProfileAward** (One-to-Many)
- `title`, `issuer`, `date`, `description`, `image`.

#### **ProfileSEO** (One-to-One with Profile)
- `meta_title`, `meta_desc`, `keywords` (JSON), `canonical_url`, `og_title`, `og_desc`, `og_image`, `json_ld` (JSON).

## 2. Backend Implementation
- **Controller**: `profileController.js`
    - `getProfile` (Public & Admin versions)
    - `updateProfile` (General info)
    - `manageSocials` (CRUD)
    - `manageSkills` (CRUD)
    - `manageExperience` (CRUD)
    - `manageEducation` (CRUD)
    - `updateSettings` (Theme, SEO)
    - `uploadMedia` (Resume, Images)
- **Routes**: `/api/admin/profile/*`

## 3. Frontend Admin Module (`src/components/admin/profile/`)
A comprehensive tabbed interface:
- **ProfileManager.jsx** (Container)
    - **Tab 1: Basic & Contact**: Form for extensive personal details.
    - **Tab 2: Professional**: Skills, Experience, Education timelines.
    - **Tab 3: Social Media**: Dyanmic list with drag-and-drop (if possible) or sort order.
    - **Tab 4: Media**: Uploaders for functionalities (Avatar, Cover, Resume).
    - **Tab 5: SEO**: Meta tag configuration.
    - **Tab 6: Settings**: Theme, Privacy, Maintenance Mode.
    - **Tab 7: Activity/Stats**: View logs and counters.

## 4. Frontend Public View
Verify the existing Portfolio frontend reflects these new fields.
- Update Hero section to use new `designation` and `resume_url`.
- Update About section for `longBio` and `stats`.
- Ensure Social Links are pulled from `ProfileSocial`.

## 5. Execution Steps
1.  **Database**: Modify `server/models/index.js` to include new schemas.
2.  **Backend**: Implement Controller and Routes.
3.  **Admin UI**: Build the Tabbed Interface.
4.  **Integration**: Connect Admin to Backend.
5.  **Validation**: Test all fields.
