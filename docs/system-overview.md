# System Overview

## Project Identity
**STS v2** - Student School Bus Service Management System

## Purpose
A comprehensive web application for managing school bus services including:
- Student enrollment and management
- Bus route planning and scheduling
- Driver and vehicle management
- Academic period management (school years/terms)
- Billing and payment tracking
- Route optimization and reporting

## Technology Stack
- **Backend**: Laravel 12.21.0
- **Frontend**: React with Inertia.js
- **Database**: MySQL (sts_v2)
- **Build Tool**: Vite with React plugin
- **Styling**: Tailwind CSS + Shadcn/ui
- **Routes**: Ziggy (Laravel routes in JavaScript)

## Key System Concepts

### Academic Periods
The system is built around academic periods:
- **School Years**: Academic years (e.g., "2024-2025")
- **School Terms**: Terms within years (e.g., "Term 1", "Fall Semester")
- Only one active school year and term at any time

### User Roles (Planned)
- **Admin**: Full system access
- **Staff**: Bus route and student management
- **Drivers**: Route assignments and updates
- **Parents**: View student bus information

### Core Modules (Planned)
1. **Student Management**: Student profiles, enrollment
2. **Route Management**: Bus routes, stops, schedules
3. **Driver Management**: Driver profiles, assignments
4. **Vehicle Management**: Bus fleet tracking
5. **Billing**: Service fees, payment tracking
6. **Reporting**: Usage analytics, performance metrics