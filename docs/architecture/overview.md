# Architecture Overview

## Design Pattern
**Service-Repository Pattern with Action Classes**

## Directory Structure
```
app/
├── Http/Controllers/     # Handle HTTP requests & responses
├── Http/Requests/        # Form validation
├── Services/            # Business logic & orchestration
├── Actions/             # Single-purpose operations
├── Models/              # Eloquent models
├── Helpers/             # Helper classes
└── helpers.php          # Global helper functions
```

## Design Principles
- **Controllers**: Thin, handle HTTP concerns only
- **Services**: Business logic coordination
- **Actions**: Single responsibility, focused tasks
- **Form Requests**: Centralized validation
- **Dependency Injection**: Throughout the application

## Authentication System
- **Controller**: `AuthController` - handles login/logout routes
- **Service**: `AuthService` - coordinates auth operations
- **Actions**: `LoginUserAction`, `LogoutUserAction` - specific auth tasks
- **Request**: `LoginRequest` - validation for login form
- **Routes**: `/login` (GET/POST), `/logout` (POST)

## Frontend Architecture
- **Pages**: `resources/js/Pages/` (Inertia.js pages)
- **Components**: `resources/js/components/ui/` (Shadcn/ui components)
- **Utils**: `resources/js/lib/utils.js` (Utility functions)
- **App Entry**: `resources/js/app.jsx`
- **Blade Template**: `resources/views/app.blade.php`

## Theme System
- **New York + Violet theme** with Shadcn/ui
- **Dark mode support** ready
- **Glassmorphism effects** for modern UI
- **Responsive design** throughout