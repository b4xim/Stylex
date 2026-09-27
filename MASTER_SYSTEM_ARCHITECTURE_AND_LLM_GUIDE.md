# 🏛️ StyleX Signature Salon Flagship — Master System Architecture & LLM Guide

> **Target Audience:** Future Large Language Models (LLMs), AI Coding Agents, and Full-Stack Engineers.  
> **Purpose:** Serves as the single source of truth for the entire StyleX codebase. Read this document first to understand how every component, database model, API endpoint, and deployment pipeline connects together.

---

## 📑 Table of Contents
1. [Executive Overview & Repository Layout](#1-executive-overview--repository-layout)
2. [Technology Stack Matrix](#2-technology-stack-matrix)
3. [End-to-End System Architecture & Data Flow](#3-end-to-end-system-architecture--data-flow)
4. [Database Schema & Data Dictionary (Prisma + PostgreSQL)](#4-database-schema--data-dictionary-prisma--postgresql)
5. [Complete REST API Specification](#5-complete-rest-api-specification)
6. [Business Logic & Concurrency Guard](#6-business-logic--concurrency-guard)
7. [WhatsApp & Email Integration Architecture](#7-whatsapp--email-integration-architecture)
8. [Single-Server OCI Deployment Runbook](#8-single-server-oci-deployment-runbook)
9. [LLM Developer Recipes (How to Modify & Extend)](#9-llm-developer-recipes-how-to-modify--extend)

---

## 1. Executive Overview & Repository Layout

The StyleX repository is organized as a unified full-stack monorepo comprising three core subsystems:
1. **Customer Web Application (`/` root):** Public-facing luxury salon portal built with React, Vite, and modern styling. Features interactive booking wizard, service discovery, master artisans showcase, vertical video reels player, transformation gallery, and salon rituals.
2. **Admin Operations Portal (`/Stylex_Dashboard`):** Private managerial suite for salon staff. Includes live appointment management, calendar slot blocker, treatments/menu editor, staff roistering, promotions manager (hero carousel banners, vertical reels, transformation photos), customer CRM with CSV export, and WhatsApp QR / business settings.
3. **Backend API Gateway (`/backend`):** Production-grade REST API built with Node.js, Express, TypeScript, and Prisma ORM connecting to PostgreSQL 16. Implements ACID transaction concurrency control, JWT authentication, Meta WhatsApp Cloud API integration, Nodemailer email vouchers, and local/cloud media uploads.
4. **Single-Instance OCI Orchestration (`docker-compose.yml` & `/nginx`):** Docker Compose configuration containerizing PostgreSQL 16, Node API, and Nginx with Certbot SSL termination for deployment on a single Oracle Cloud Infrastructure (OCI) Compute instance.

### Directory Structure Tree
```text
Stylex/
├── index.html                      # Customer SPA HTML entrypoint
├── package.json                    # Customer frontend dependencies (Vite, React 18, Lucide)
├── tsconfig.json                   # Customer TypeScript config
├── vite.config.ts                  # Customer Vite build config
├── src/
│   ├── main.tsx                    # React client mount
│   ├── App.tsx                     # Main layout, sticky nav, modals coordinator
│   ├── types.ts                    # Customer TypeScript data interfaces
│   ├── data/
│   │   └── salonData.ts            # Canonical salon information, default services, artisans
│   └── components/
│       ├── Header.tsx              # Luxury branding, emergency helpline, navigation
│       ├── HeroCarousel.tsx        # High-impact promotional banner carousel
│       ├── BookingModal.tsx        # Interactive multi-step booking modal
│       ├── BookingEngine.tsx       # Embedded slot picker & appointment form
│       ├── ServicesMenu.tsx        # Tabbed treatments catalog (Gents / Ladies)
│       ├── AtelierReels.tsx        # Vertical video reels showcase & transformation gallery
│       ├── ReelModal.tsx           # Full-screen vertical reel player with HTML5 video
│       ├── MasterArtisans.tsx      # Stylist portfolio cards with direct booking
│       ├── SalonExperience.tsx     # Tirur flagship ambiance & hygiene protocols
│       ├── CustomerReviews.tsx     # Google reviews & verified client testimonials
│       └── Footer.tsx              # Map coordinates, operating hours, social links
│
├── Stylex_Dashboard/               # Admin Management Suite
│   ├── index.html                  # Dashboard SPA entrypoint
│   ├── package.json                # Dashboard dependencies (React 18, Vite, TailwindCSS)
│   ├── src/
│   │   ├── main.tsx                # Dashboard React mount
│   │   ├── App.tsx                 # Dashboard navigation, state sync, modal triggers
│   │   ├── types.ts                # Dashboard administrative data models
│   │   ├── mockData.ts             # Initial dashboard state & mock database
│   │   ├── components/
│   │   │   ├── AppointmentsView.tsx # Live bookings table, filter by date/status, WhatsApp link
│   │   │   ├── CalendarView.tsx    # Slot blocker & holiday closure manager
│   │   │   ├── TreatmentsView.tsx  # Service menu manager (add/edit/delete pricing & categories)
│   │   │   ├── ArtisansView.tsx    # Stylist roster & leave status toggle
│   │   │   ├── PromotionsView.tsx  # Hero banners, vertical reels, and photo transformations
│   │   │   ├── CustomerCRMView.tsx # Client database, total visits, lifetime spend, CSV export
│   │   │   ├── SettingsView.tsx    # Salon settings, dynamic Save button, WhatsApp QR setup
│   │   │   └── modals/             # Admin creation & edit dialogs
│
├── backend/                        # Express + TypeScript + Prisma API
│   ├── package.json                # API dependencies (Express, Prisma, JWT, Multer, etc.)
│   ├── tsconfig.json               # Backend TypeScript compilation configuration
│   ├── Dockerfile                  # Multi-stage production container build
│   ├── .env.example                # Template for environment secrets
│   ├── .env                        # Active environment configuration
│   ├── prisma/
│   │   ├── schema.prisma           # Relational PostgreSQL database models
│   │   └── seed.ts                 # Full database seed script with initial salon data
│   └── src/
│       ├── server.ts               # HTTP server lifecycle & graceful shutdown
│       ├── app.ts                  # Express application setup, CORS, Helmet, static uploads
│       ├── config/
│       │   ├── db.ts               # Prisma Client singleton instance
│       │   └── env.ts              # Typed environment variables
│       ├── middleware/
│       │   ├── auth.ts             # JWT token verification & RBAC authorization
│       │   ├── errorHandler.ts     # Global structured JSON error handler
│       │   └── upload.ts           # Multer media uploader (banners, reels, photos)
│       ├── services/
│       │   ├── slotService.ts      # Concurrency slot availability & reference generator (SX-XXXX)
│       │   ├── whatsappService.ts  # Meta WhatsApp Cloud API & Click-to-Chat QR generator
│       │   └── emailService.ts     # Nodemailer HTML appointment confirmation vouchers
│       ├── controllers/            # Controller business logic
│       │   ├── authController.ts
│       │   ├── bookingController.ts
│       │   ├── serviceController.ts
│       │   ├── stylistController.ts
│       │   ├── blockedSlotController.ts
│       │   ├── promotionController.ts
│       │   ├── customerController.ts
│       │   ├── settingController.ts
│       │   └── uploadController.ts
│       └── routes/                 # Express routers mounted under /api/v1
│           ├── index.ts
│           ├── authRoutes.ts
│           ├── bookingRoutes.ts
│           ├── serviceRoutes.ts
│           ├── stylistRoutes.ts
│           ├── blockedSlotRoutes.ts
│           ├── promotionRoutes.ts
│           ├── customerRoutes.ts
│           ├── settingRoutes.ts
│           └── uploadRoutes.ts
│
├── nginx/
│   └── conf.d/
│       └── default.conf            # Nginx reverse proxy routing API, uploads, admin & client
├── docker-compose.yml              # Single-server OCI orchestration (Postgres + API + Nginx)
└── WHATSAPP_EMAIL_INTEGRATION_GUIDE.md # Technical guide for Meta Cloud API & Nodemailer
```

---

## 2. Technology Stack Matrix

| Layer | Technology | Version | Key Libraries / Roles |
| :--- | :--- | :--- | :--- |
| **Customer Frontend** | React + TypeScript + Vite | React 18, Vite 6 | Lucide icons, Google Fonts (Plus Jakarta Sans, Cormorant Garamond), Tailwind utility classes |
| **Admin Dashboard** | React + TypeScript + Vite | React 18, Vite 6 | Material Symbols, TailwindCSS 4, CSV exporter, LocalStorage sync bridge |
| **Backend Runtime** | Node.js | v22 LTS | Express 4.21, TypeScript 5.7, Ts-Node-Dev |
| **ORM & Database** | Prisma ORM + PostgreSQL | Prisma 5.22, PG 16 | Relational schema, ACID transactions, row-level concurrency lock, automatic migrations |
| **Authentication** | JWT (JSON Web Tokens) | jsonwebtoken 9.0 | 7-day signed session tokens, bcryptjs password hashing |
| **File Uploads** | Multer | 1.4.5 LTS | Multi-part form uploads for vertical reels (MP4/WEBM) and photos (JPEG/PNG/WEBP) |
| **Notifications** | Meta WhatsApp Cloud API + Nodemailer | Axios + Nodemailer 6 | Automated WhatsApp template messages, Click-to-Chat links, QR generator, HTML email vouchers |
| **Web Server / Proxy** | Nginx Alpine | 1.25+ | Reverse proxy for `/api/`, static `/uploads/`, SPA routing for `/admin` and `/`, Gzip, SSL |
| **Infrastructure** | Oracle Cloud Infrastructure (OCI) | Ubuntu 22.04 LTS | Single Compute Instance (Ampere A1 or AMD E4 standard, 12GB RAM, 200GB NVMe storage) |

---

## 3. End-to-End System Architecture & Data Flow

```text
                                [ CLIENT BROWSER / MOBILE ]
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
             [ Customer Web App ]                        [ Admin Dashboard ]
             (Port 80/443: / )                           (Port 80/443: /admin )
                       │                                           │
                       └─────────────────────┬─────────────────────┘
                                             │ HTTPS Requests
                                             ▼
                                     [ NGINX GATEWAY ]
                                     (Reverse Proxy & SSL)
                                             │
                     ┌───────────────────────┼───────────────────────┐
                     ▼                       ▼                       ▼
            [ Static Frontend ]     [ Uploaded Assets ]      [ Node.js API Gateway ]
            (/usr/share/nginx/html) (/uploads/*)             (http://api:5000/api/v1)
                                                                     │
                                     ┌───────────────────────────────┴───────────────────────────────┐
                                     ▼                                                               ▼
                           [ Prisma ORM Client ]                                            [ Background Dispatchers ]
                                     │                                                               │
                                     ▼                                               ┌───────────────┴───────────────┐
                          [ PostgreSQL 16 DB ]                                       ▼                               ▼
                      (ACID Concurrency & Ledgers)                         [ WhatsApp Cloud API ]          [ Nodemailer SMTP ]
                                                                           (Automated Booking SMS)         (HTML Booking Voucher)
```

### Complete Booking Execution Flow
1. **Slot Inquiry:** Customer selects a date and service. Frontend queries `GET /api/v1/bookings/slots?date=YYYY-MM-DD`. `SlotService` calculates availability by subtracting confirmed bookings and blocked slots from the daily operational roster (`09:00 AM – 09:00 PM`).
2. **Reservation Submission:** Customer submits appointment form (`POST /api/v1/bookings`).
3. **Double-Booking Prevention:** API initiates a database transaction via `SlotService.assertSlotAvailable()`. If another request reserved the slot milliseconds earlier, a `409 Conflict` is returned immediately.
4. **CRM Auto-Capture:** The customer's mobile number and name are upserted into the `customers` CRM table. Visit counts and cumulative lifetime spend are incremented automatically.
5. **Ledger Record Created:** A new booking is persisted with reference code format `SX-XXXX` (e.g. `SX-8492`).
6. **Asynchronous Alerts:** The system triggers:
   - Meta WhatsApp Cloud API confirmation message to the client's phone.
   - Nodemailer HTML appointment confirmation voucher (if email provided).
   - Generates a direct WhatsApp link (`https://wa.me/919656111149?text=...`) for one-tap client follow-up.
7. **Admin Real-time Visibility:** The new reservation appears in the Admin Dashboard Appointments view with direct WhatsApp messaging controls.

---

## 4. Database Schema & Data Dictionary (Prisma + PostgreSQL)

The database schema is defined in [backend/prisma/schema.prisma](file:///Users/basimahamed/Desktop/Projects/StyleX/Stylex/backend/prisma/schema.prisma).

### 1. `admin_users`
Stores administrative staff credentials, developer access, and secret emergency accounts.
- `id` (UUID, PK): Unique admin identifier.
- `username` (String, Unique, Nullable): Optional handle for fast login (e.g. `admin`, `developer`, `bladeoski`).
- `email` (String, Unique): Login email address (e.g. `admin@stylexsalon.in`).
- `passwordHash` (String): Salted bcrypt password hash.
- `name` (String): Display name of the operator.
- `role` (String, Default: "MANAGER"): Access level (`ADMIN`, `DEVELOPER`, `MANAGER`, `STAFF`).
  - Frontend Display: `Admin`, `Developer`, `Manager`, `Staff` (View-Only).
- `isSecret` (Boolean, Default: false): When `true`, user is omitted from directory listings, count badges, and public API responses (e.g. root secret account `bladeoski`).
- `isActive` (Boolean, Default: true): Soft-disable account toggle.
- `lastLoginAt` (DateTime, Nullable): Timestamp of most recent authentication.
- `createdAt` / `updatedAt` (DateTime): Audit timestamps.

### 2. `customers`
Customer relationship management (CRM) database storing client profiles and marketing metrics.
- `id` (UUID, PK): Unique customer ID.
- `name` (String): Full name.
- `phone` (String): Mobile number without country code (e.g. `9656111149`).
- `countryCode` (String, Default: "+91"): International dialing code.
- `email` (String, Nullable): Optional email address.
- `notes` (String, Nullable): Styling preferences or allergy notes.
- `totalVisits` (Int, Default: 0): Lifetime appointments attended.
- `totalSpent` (Float, Default: 0.0): Cumulative amount spent in INR.
- **Constraints:** `@@unique([countryCode, phone])`, `@@index([phone])`, `@@index([email])`.

### 3. `services`
Treatments and service menu catalog for the Tirur flagship.
- `id` (String, PK): Slug identifier (e.g. `signature-haircut-gents`, `french-balayage`).
- `name` (String): Display name.
- `category` (String): Grouping (e.g. `Hair & Styling`, `Beard & Shave`, `Skin & Facial`).
- `gender` (String): Gender target (`gents`, `ladies`, `unisex`).
- `durationMins` (Int): Estimated ritual duration in minutes.
- `price` (Float): Treatment fee in INR.
- `originalPrice` (Float, Nullable): Strikethrough price for discounted treatments.
- `description` (String, Nullable): Detailed ritual summary.
- `benefits` (String, Nullable): JSON stringified array of treatment highlights.
- `isPopular` (Boolean): Highlight with popular badge.
- `isTrending` (Boolean): Highlight in trending rituals section.
- `isActive` (Boolean): Menu visibility toggle.

### 4. `stylists`
Staff directory and master artisans.
- `id` (String, PK): Slug identifier (e.g. `niya-mathew`, `saneesh-kumar`).
- `name` (String): Stylist display name.
- `role` (String): Title (e.g. `Master Hair Artisan`, `Senior Barber & Sculptor`).
- `gender` (String): `female`, `male`, or `any`.
- `specialty` (String): Core expertise description.
- `bio` (String, Nullable): Artisan biography.
- `imageUrl` (String): Portrait photograph URL.
- `rating` (Float, Default: 4.9): Client satisfaction rating out of 5.0.
- `experience` (String, Nullable): Years in the industry (e.g. `9+ Years`).
- `isActive` (Boolean): On-duty status toggle.

### 5. `bookings`
Core transactional ledger of all appointments.
- `id` (UUID, PK): Unique record ID.
- `bookingRef` (String, Unique): Customer-facing reference code (format: `SX-XXXX`).
- `customerId` (UUID, FK -> `customers.id`): Associated client.
- `serviceId` (String, FK -> `services.id`): Primary selected service.
- `secondaryServiceId` (String, Nullable): Secondary service slug if selected from promo.
- `secondaryService` (String, Nullable): Name of secondary ritual.
- `secondaryPrice` (Float, Nullable): Price of secondary ritual.
- `stylistId` (String, Nullable, FK -> `stylists.id`): Preferred artisan.
- `date` (String): Appointment date formatted as `YYYY-MM-DD`.
- `timeSlot` (String): Time slot label (e.g. `10:30 AM`).
- `status` (String, Default: "CONFIRMED"): `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `NO_SHOW`.
- `subtotal` / `total` (Float): Financial values in INR.
- `paymentStatus` (String): `PENDING`, `PAID`, `PAY_AT_SALON`, `UPI`.
- `whatsappStatus` (String): `NOT_SENT`, `SENT`, `FAILED`.
- `emailStatus` (String): `NOT_SENT`, `SENT`, `FAILED`.
- `source` (String): `WEBSITE`, `ADMIN_DASHBOARD`, `WALK_IN`.
- **Indexes:** `@@index([date, timeSlot])`, `@@index([status])`, `@@index([customerId])`.

### 6. `blocked_slots`
Salon calendar overrides and staff blackout hours.
- `id` (UUID, PK): Identifier.
- `date` (String): Date formatted as `YYYY-MM-DD`.
- `timeSlot` (String): Specific slot (e.g. `04:30 PM`) or `ALL_DAY` for whole-day salon closure.
- `stylistId` (String, Nullable): If set, blocks only that specific stylist; if `null`, blocks the entire salon.
- `reason` (String, Nullable): Reason for hold (e.g. "VIP Bridal Party", "Power Maintenance").
- `createdBy` (String, Nullable): Staff member who placed the lock.
- **Constraints:** `@@unique([date, timeSlot, stylistId])`.

### 7. `carousel_banners`
Promotional slide banners displayed at the top of the customer website.
- `id` (UUID, PK): Identifier.
- `title` (String): Slide headline.
- `subtitle` (String, Nullable): Supporting description.
- `badge` (String, Nullable): Accent badge (e.g. `Limited Privilege`).
- `ctaText` (String, Nullable): Button label (e.g. `Book Ritual`).
- `link` (String, Nullable): On-click anchor or URL.
- `imageUrl` (String): High-resolution banner image.
- `orderIndex` (Int, Default: 0): Sequence sort order.
- `isActive` (Boolean): Display toggle.

### 8. `reels`
Vertical video reels displayed in the Atelier Reels section.
- `id` (UUID, PK): Identifier.
- `title` (String): Video title.
- `tag` (String): Style badge (e.g. `Hair Smoothening`, `Gents Fade`).
- `category` (String): Category filter.
- `imageUrl` (String): 9:16 vertical poster/thumbnail image.
- `videoUrl` (String, Nullable): Direct MP4/WEBM URL for native video playback.
- `instagramUrl` (String, Nullable): Link to view original Instagram reel.
- `audioTrack` (String, Nullable): Name of music or ritual audio.
- `stylistHandle` (String, Nullable): Instagram handle of the artisan (e.g. `@niya_stylex`).
- `isActive` (Boolean): Visibility toggle.

### 9. `portfolio_works`
Transformation photographs displayed in the Client Artistry Gallery.
- `id` (UUID, PK): Identifier.
- `title` (String): Photo description (e.g. `Royal Beard Sculpt & Fade`).
- `category` (String): Category (e.g. `Bridal Makeover`, `Gents Grooming`).
- `artisan` (String): Stylist name who performed the work.
- `imageUrl` (String): 4:5 transformation photograph URL.
- `description` (String, Nullable): Styling notes.
- `isActive` (Boolean): Visibility toggle.

### 10. `salon_settings`
Dynamic key-value configuration storage for salon operations.
- `id` (UUID, PK): Unique record ID.
- `key` (String, Unique): Setting name (e.g. `whatsappNumber`, `hours`, `addressLine1`).
- `value` (String): Value string or stringified JSON object.
- `updatedAt` (DateTime): Last modification time.

---

## 5. Complete REST API Specification

All backend endpoints are prefixed with `/api/v1` and return standardized JSON responses:
```json
{
  "success": true,
  "message": "Optional descriptive status message",
  "data": { ... }
}
```

### 1. Authentication (`/api/v1/auth`)
| Method | Endpoint | Auth | Description | Payload / Query |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | None | Authenticate admin staff & issue JWT | `{ "email": "admin@stylex.com", "password": "..." }` |
| `GET` | `/api/v1/auth/me` | Bearer JWT | Retrieve current logged-in admin profile | None |
| `POST` | `/api/v1/auth/change-password` | Bearer JWT | Change staff account password | `{ "currentPassword": "...", "newPassword": "..." }` |

### 2. Appointments & Booking (`/api/v1/bookings`)
| Method | Endpoint | Auth | Description | Payload / Query |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/bookings/slots` | None | Query available 30-min slots for a given date | Query: `?date=YYYY-MM-DD&stylistId=...` |
| `POST` | `/api/v1/bookings` | None | Book appointment (includes concurrency check & alerts) | Body: `{ customerName, customerPhone, customerEmail?, serviceId, date, timeSlot, stylistId?, notes? }` |
| `GET` | `/api/v1/bookings` | Bearer JWT | List appointments with filters | Query: `?date=YYYY-MM-DD&status=ALL&search=...&limit=100` |
| `PATCH`| `/api/v1/bookings/:id/status`| Bearer JWT | Update booking status (`CONFIRMED`, `COMPLETED`, `CANCELLED`) | Body: `{ "status": "COMPLETED", "paymentStatus": "PAID" }` |
| `POST` | `/api/v1/bookings/:id/resend-whatsapp` | Bearer JWT | Trigger WhatsApp voucher resend | None |

### 3. Service Treatments Catalog (`/api/v1/services`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/services` | None | List treatments (filters: `?gender=gents&category=hair`) |
| `GET` | `/api/v1/services/:id` | None | Get detailed treatment specifications |
| `POST` | `/api/v1/services` | Bearer JWT | Create new service treatment |
| `PUT` | `/api/v1/services/:id` | Bearer JWT | Update pricing, duration, or details |
| `DELETE`| `/api/v1/services/:id`| Bearer JWT | Soft-delete / deactivate treatment |

### 4. Stylists & Artisans (`/api/v1/stylists`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/stylists` | None | List active salon artisans & directors |
| `POST` | `/api/v1/stylists` | Bearer JWT | Add new artisan profile |
| `PUT` | `/api/v1/stylists/:id` | Bearer JWT | Update artisan bio, rating, photo, or status |
| `DELETE`| `/api/v1/stylists/:id`| Bearer JWT | Deactivate artisan from roster |

### 5. Calendar Slot Blocker (`/api/v1/blocked-slots`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/blocked-slots` | None | List blocked slots (query: `?date=YYYY-MM-DD` or `?startDate=...&endDate=...`) |
| `POST` | `/api/v1/blocked-slots` | Bearer JWT | Freeze slot or full day (`timeSlot: "ALL_DAY"`) |
| `DELETE`| `/api/v1/blocked-slots/:id`| Bearer JWT | Remove calendar hold |

### 6. Promotions & Media Management (`/api/v1/promotions`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/promotions/banners` | None | List carousel hero banners |
| `POST` | `/api/v1/promotions/banners` | Bearer JWT | Upload / create hero banner slide |
| `PUT` | `/api/v1/promotions/banners/:id` | Bearer JWT | Update banner headline, CTA, or sort order |
| `DELETE`| `/api/v1/promotions/banners/:id`| Bearer JWT | Delete banner slide |
| `GET` | `/api/v1/promotions/reels` | None | List vertical salon reels |
| `POST` | `/api/v1/promotions/reels` | Bearer JWT | Create vertical reel entry |
| `PUT` | `/api/v1/promotions/reels/:id` | Bearer JWT | Edit reel metadata or active state |
| `DELETE`| `/api/v1/promotions/reels/:id` | Bearer JWT | Delete reel |
| `GET` | `/api/v1/promotions/photos` | None | List client transformation photos |
| `POST` | `/api/v1/promotions/photos` | Bearer JWT | Upload client transformation photo |
| `PUT` | `/api/v1/promotions/photos/:id` | Bearer JWT | Update transformation photo details |
| `DELETE`| `/api/v1/promotions/photos/:id`| Bearer JWT | Delete transformation photo |

### 7. Customer CRM (`/api/v1/customers`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/customers` | Bearer JWT | Search & list customers with visit and spend stats |
| `GET` | `/api/v1/customers/export/csv` | Bearer JWT | Download complete customer database as CSV for SMS/WhatsApp marketing |
| `GET` | `/api/v1/customers/:id` | Bearer JWT | View customer appointment history and styling notes |

### 8. Salon Settings (`/api/v1/settings`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/settings` | None | Retrieve public salon metadata, hours, and WhatsApp QR |
| `GET` | `/api/v1/settings/whatsapp-qr` | None | Generate custom WhatsApp QR URL (`?phone=...&message=...`) |
| `PUT` | `/api/v1/settings` | Bearer JWT | Update salon address, emergency phone, WhatsApp number, or hours |

### 9. Media Upload Gateway (`/api/v1/upload`)
- `POST /api/v1/upload/banner` (Multipart `file` field -> saves to `/uploads/banners/`)
- `POST /api/v1/upload/reel` (Multipart `file` field -> saves to `/uploads/reels/`)
- `POST /api/v1/upload/photo` (Multipart `file` field -> saves to `/uploads/photos/`)
- `POST /api/v1/upload/general` (Multipart `file` field -> saves to `/uploads/general/`)

---

## 6. Business Logic & Concurrency Guard

### Slot Concurrency Lock
To prevent race conditions where two customers reserve the same time slot simultaneously:
1. `SlotService.assertSlotAvailable(date, timeSlot, stylistId)` performs an atomic query before reservation.
2. Inside `prisma.$transaction()`, the system:
   - Verifies zero overlapping entries in `blocked_slots`.
   - Verifies zero overlapping entries in `bookings` with status in `['CONFIRMED', 'PENDING']`.
   - Atomically inserts the booking.
3. If a conflict occurs, Prisma rolls back the transaction and throws an `AppError('Slot unavailable', 409)`.

### Reference Number Generation
- Booking codes follow the format `SX-XXXX` where `XXXX` is a 4-digit numeric sequence (e.g. `SX-4821`).
- The generator verifies database uniqueness via a retry loop before writing to disk.

---

## 7. WhatsApp & Email Integration Architecture

### Meta WhatsApp Cloud API
Configured in [backend/src/services/whatsappService.ts](file:///Users/basimahamed/Desktop/Projects/StyleX/Stylex/backend/src/services/whatsappService.ts).
- When a booking is finalized, the service contacts `https://graph.facebook.com/v19.0/{PHONE_NUMBER_ID}/messages` with an authenticated Bearer token.
- If credentials are not present in `.env`, the service falls back gracefully into development simulation mode, logging the message payload to stdout without breaking execution.
- Generates instant Click-to-Chat URLs (`https://wa.me/919656111149?text=...`) and dynamic QR Code PNG URLs for marketing displays.

### Nodemailer Email Vouchers
Configured in [backend/src/services/emailService.ts](file:///Users/basimahamed/Desktop/Projects/StyleX/Stylex/backend/src/services/emailService.ts).
- Sends styled HTML booking confirmation vouchers with salon location coordinates, appointment date, time, and service fee breakdown.
- Gracefully logs locally if SMTP credentials are left blank.

---

## 8. Single-Server OCI Deployment Runbook

Deploying StyleX on a single **Oracle Cloud Infrastructure (OCI)** Compute Instance (Ubuntu 22.04 LTS, 12GB RAM, 200GB NVMe storage):

### Step 1: Provision OCI Virtual Cloud Network (VCN)
Ensure the OCI Security List allows ingress traffic on:
- **Port 80 (HTTP)** — For initial ACME challenges and web traffic
- **Port 443 (HTTPS)** — For encrypted customer and admin traffic
- **Port 22 (SSH)** — For administrative server access
- *Note:* Do **NOT** open Port 5432 (PostgreSQL) to the internet. PostgreSQL is isolated inside the Docker network.

### Step 2: Install Docker & Docker Compose on Ubuntu
```bash
sudo apt-get update && sudo apt-get install -y ca-certificates curl gnupg lsb-release
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Step 3: Clone Codebase & Build Frontends
```bash
git clone <YOUR_GIT_REPO_URL> /var/www/stylex
cd /var/www/stylex

# Build Customer Frontend Production Bundle
npm install
npm run build # Generates /dist

# Build Admin Dashboard Production Bundle
cd Stylex_Dashboard
npm install
npm run build # Generates Stylex_Dashboard/dist
cd ..
```

### Step 4: Configure Backend Environment
```bash
cp backend/.env.example backend/.env
nano backend/.env
# Update JWT_SECRET, POSTGRES_PASSWORD, and optional Meta WhatsApp credentials
```

### Step 5: Launch Stack via Docker Compose
```bash
docker compose up -d --build
```
This starts:
1. `stylex_postgres` (PostgreSQL 16 with persistent volume `stylex_pgdata`)
2. `stylex_api` (Node API running Prisma migrations and Express on port 5000)
3. `stylex_nginx` (Nginx reverse proxy on ports 80 & 443)

### Step 6: Seed Database
```bash
docker compose exec api npm run prisma:seed
```

### Step 7: Provision Free SSL Certificate via Certbot
```bash
sudo apt-get install -y certbot
sudo certbot certonly --webroot -w ./certbot/www -d yourdomain.com -d www.yourdomain.com
```

---

## 9. LLM Developer Recipes (How to Modify & Extend)

Follow these exact patterns whenever the user asks an AI agent to add or modify features:

### 🧩 Recipe 1: How to Add a New Database Model
1. Open [backend/prisma/schema.prisma](file:///Users/basimahamed/Desktop/Projects/StyleX/Stylex/backend/prisma/schema.prisma) and add your model (e.g. `model SpecialOffer { ... }`).
2. Run Prisma migration / client generation:
   ```bash
   cd backend
   npx prisma generate
   ```
3. Update [backend/prisma/seed.ts](file:///Users/basimahamed/Desktop/Projects/StyleX/Stylex/backend/prisma/seed.ts) to populate initial sample rows.
4. Export the TypeScript type in both [backend/src/types.ts](file:///Users/basimahamed/Desktop/Projects/StyleX/Stylex/backend/src/types.ts) and frontend [types.ts](file:///Users/basimahamed/Desktop/Projects/StyleX/Stylex/src/types.ts).

### ⚡ Recipe 2: How to Add a New API Endpoint
1. Create a controller method in the relevant file under `backend/src/controllers/` (e.g. `promotionController.ts`).
2. Wrap the controller in `try { ... } catch (error) { next(error); }` so `errorHandler` handles issues gracefully.
3. Attach the route to the router in `backend/src/routes/` with appropriate middleware (`authenticateToken` if private).
4. Run `npx tsc --noEmit` in `backend` to guarantee type safety before responding.

### 🎨 Recipe 3: How to Add a New Section in Admin Dashboard
1. Open [Stylex_Dashboard/src/App.tsx](file:///Users/basimahamed/Desktop/Projects/StyleX/Stylex/Stylex_Dashboard/src/App.tsx).
2. Add a new view key to the `activeTab` state (e.g. `'inventory' | 'marketing'`).
3. Add a navigation button in the sidebar with a corresponding Material Symbol icon.
4. Create the view component in `Stylex_Dashboard/src/components/YourNewView.tsx`.
5. Connect it to fetch data from `/api/v1/...` with a fallback to `localStorage` or `mockData` for offline development.
6. Verify compilation by running `cd Stylex_Dashboard && npx tsc --noEmit`.

### 📱 Recipe 4: How to Add a Custom Notification Trigger
1. Open [backend/src/services/whatsappService.ts](file:///Users/basimahamed/Desktop/Projects/StyleX/Stylex/backend/src/services/whatsappService.ts).
2. Define a new payload interface and method (e.g. `sendAppointmentReminder(payload)` or `sendStaffAlert(payload)`).
3. Call the method asynchronously from your controller without `await` to keep the HTTP response instantaneous, and handle errors in a `.catch()` block.

---
*Created and maintained for the StyleX Signature Salon Engineering Team.*
