# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# STS v2 - Student School Bus Service Management System

## 📖 Documentation
**This project uses structured documentation in the `/docs` folder:**

👉 **[READ FULL DOCUMENTATION](./docs/README.md)** 👈

## 🚀 Quick Reference

### System Identity
**Student School Bus Service Management System** - Laravel + Inertia.js + React

### Database Connection
- **Host**: 127.0.0.1:3306
- **Database**: sts_v2
- **Username**: root
- **Password**: password

### Development Commands
```bash
# Full Development Stack
composer dev             # Start all services (server, queue, logs, vite)

# Individual Services
npm run dev              # Start frontend dev server (Vite)
php artisan serve        # Start Laravel server
php artisan queue:listen --tries=1  # Start queue worker
php artisan pail --timeout=0        # Start log viewer

# Asset Management
npm run build            # Build frontend assets for production
php artisan ziggy:generate  # Generate routes for JS

# Code Quality
composer test            # Run PHPUnit tests
./vendor/bin/pint        # Format PHP code (Laravel Pint)
```

### Current Features
- ✅ Authentication system (login/logout)
- ✅ School Year & Term management system
- ✅ Beautiful Shadcn/ui theme (Custom warm palette - Blue/Yellow/Orange)
- ✅ Collapsible sidebar layout system
- ✅ Districts CRUD module
- ✅ Upload Batches system for student data imports

### Helper Functions (School Periods)
```php
active_school_year()     // Get active SchoolYear model
active_school_term()     // Get active SchoolTerm model
active_period_string()   // "2024-2025 - Term 1"
has_active_period()      // Boolean check
```

### Test Login Credentials
- **Email**: test@example.com
- **Password**: password

### Layout System
**Collapsible Sidebar Layout**
- Uses `DashboardLayout` component for all authenticated pages
- Desktop: Fixed sidebar with collapse/expand functionality
- Mobile: Overlay sidebar with backdrop dismiss
- Location: `resources/js/components/DashboardLayout.jsx`
- Sidebar Components: `resources/js/components/ui/sidebar.jsx`

### Districts Module
**Full CRUD Operations**
- Create, Read, Update, Delete districts
- Fields: District Name, District Code
- Soft delete functionality
- Audit trail: created_by, updated_by
- Location: `resources/js/Pages/Districts/Index.jsx`

### Upload Batches System
**Bulk Student Data Import System**

**Architecture:**
- 3-tier system: upload_batches → uploaded_files → student_routes_validations
- Asynchronous processing via Laravel jobs
- Queue-based background file processing

**Key Models & Relationships:**
- `UploadBatch`: Groups related file uploads, tracks batch status
- `UploadedFile`: Individual Excel files with processing progress
- `StudentRoutesValidation`: Parsed student route data (53+ fields)

**Workflow:**
1. Create named batch → Upload Excel files → Background processing
2. File status: pending → processing → completed/failed
3. Batch status auto-updates based on all files completion

**Controllers:**
- `UploadBatchController`: CRUD with server-side search/pagination
- `StudentDataUploadController`: File upload handling, job dispatching

**Job Processing:**
- `ProcessStudentDataFile`: Excel parsing with PhpSpreadsheet
- Progress tracking every 100 records
- Comprehensive error handling and status updates

**Routes:**
- `/upload-batches` - Resource routes for batch management
- `/upload-batches/{id}/upload` - File upload endpoint

**Frontend:**
- `Pages/StudentDataUpload/Index.jsx` - Batch listing with search/sort
- `Pages/StudentDataUpload/Show.jsx` - Drag-drop upload interface

**Storage:**
- Files stored in `storage/app/student-routes/` with UUID naming
- Excel validation (10MB max per file)
- Database-driven queue system

### UI/UX Guidelines
**Modal Button Layout**
- Positive actions (Create, Update, Save): Right-most position, primary background, white text
- Cancel/Neutral actions: Left of primary action, outline/neutral styling
- Layout: Right-aligned button group with space between buttons
- Button order: [Cancel] [Primary Action] (both right-aligned)

**Color Usage**
- Danger/Destructive actions (Delete, Disable): Use #DC3C22 (destructive variant)
- Primary actions: Use #799EFF (primary variant)
- Secondary/Cancel: Use outline or neutral styling

**Button Interaction**
- Cursor: Always use `cursor: pointer` when hovering over buttons
- Applies to all button variants (primary, outline, destructive, etc.)

**List Display Guidelines**
- Default style: Table format with columns
- Search box: Top right position above table
- Search: Server-side search implementation
- Sorting: Server-side sorting on column headers
- Pagination: Server-side pagination with page controls
- Action buttons: Always in the last column, right-aligned

**Page Header Design**
- Header section: Contains only title and description, left-aligned
- Action section: Contains search box and general actions (Add, etc.), right-aligned
- Layout: [Page Header: Title + Description]
         [Action Bar: General Actions ... Search Box]
         [Table with sortable headers, Actions column last]
         [Pagination controls at bottom]

**Table Column Order**
- Data columns: Left to right in logical order
- Actions column: Always last column
- Actions alignment: Right-aligned within the cell
- Actions header: "Actions" text, right-aligned (use className="text-right")

## 📁 Documentation Structure
- **[System Overview](./docs/system-overview.md)** - Project purpose and tech stack
- **[Architecture](./docs/architecture/overview.md)** - Design patterns and structure
- **[Features](./docs/features/)** - Feature-specific documentation
- **[Database](./docs/database/)** - Schema and relationships

## 🏗️ Architecture Overview

**Laravel + Inertia.js + React Stack**
- **Backend**: Laravel 12 with MySQL database
- **Frontend**: React 19 with Inertia.js for SPA-like experience
- **UI Framework**: Tailwind CSS 4.0 + Shadcn/ui components
- **Build Tool**: Vite for fast development and optimized builds
- **Queue System**: Database-driven job processing for file uploads

**Key Architecture Patterns:**
- **Actions Pattern**: Business logic encapsulated in dedicated Action classes (`app/Actions/`)
- **Service Layer**: Complex operations handled by Service classes (`app/Services/`)
- **Inertia Pages**: React components in `resources/js/Pages/` mapped to Laravel routes
- **Shared Components**: Reusable UI components in `resources/js/components/`
- **Helper Functions**: Global PHP helpers in `app/helpers.php` for school periods

**Database Architecture:**
- **Soft Deletes**: Most models use soft delete functionality
- **Audit Trail**: Created/updated by tracking on main entities
- **Relationships**: Extensive use of Eloquent relationships across models
- **Migrations**: Sequential migrations with proper foreign key constraints

**File Processing System:**
- **3-Tier Upload System**: `upload_batches` → `uploaded_files` → `student_routes_validations`
- **Background Processing**: Laravel Jobs with progress tracking
- **File Storage**: UUID-based naming in `storage/app/student-routes/`
- **Queue Workers**: Separate queue listener for background file processing

---
💡 **For detailed information about any aspect of the system, check the `/docs` folder!**