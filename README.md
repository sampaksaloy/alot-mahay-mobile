# Alot Mahay — Mobile (React Native, Clean Architecture)

Mobile-Based Queue Management and Waiting Time Prediction System
para sa Salon and Barbershop Services.

## Folder Structure

```
alot-mahay-mobile/
├── assets/                  # images, icons
├── src/
│   ├── core/                # shared infra: constants, theme, network, storage, utils
│   ├── features/            # one folder per domain feature
│   │   ├── auth/
│   │   │   ├── data/            # datasources (API calls), models, repository implementations
│   │   │   ├── domain/          # entities, repository interfaces, usecases (business rules)
│   │   │   └── presentation/    # screens, hooks, components
│   │   ├── customer/
│   │   ├── queue/
│   │   ├── services/
│   │   ├── staff/
│   │   ├── admin/
│   │   ├── ratings/
│   │   ├── notifications/
│   │   └── prediction/
│   ├── navigation/           # AuthStack, CustomerStack, StaffStack, AdminStack, AppNavigator
│   └── components/           # shared/reusable UI (Button, InputField, QueueStatusBadge, ...)
├── App.js
└── package.json
```

## Clean Architecture per feature (parehas sa backend nga MVC + Clean Arch)

| Layer        | Responsibility                                              | Backend counterpart          |
|--------------|---------------------------------------------------------------|-------------------------------|
| data         | Raw API calls (datasources), JSON→object mapping (models), repository implementation | repositories/, models/ |
| domain       | Entities, repository interfaces, usecases (validation + business rules) | services/, schemas/    |
| presentation | Screens (UI), hooks (state + calling usecases), shared components | routers/, controllers/  |

Rule: **presentation never calls `data/` directly.** Screens/hooks call `domain/usecases`,
usecases call `domain/repositories` (interface) na gi-implement sa `data/repositories`.

## Setup

```bash
npm install
npx expo start
```

Update `src/core/constants/apiEndpoints.js` → `BASE_URL` para itudlo sa imong
FastAPI backend (default: `http://10.0.2.2:8000` para sa Android emulator).

## Status

Skeleton pa ni — mga screens naa nay basic UI + wiring sa usecases/hooks,
pero daghan pa TODO (form validation polish, loading/error states, pagination,
real-time updates, ML prediction integration). Sundon ang MUST HAVE → SHOULD HAVE
→ OPTIONAL priority order gikan sa blueprint.
