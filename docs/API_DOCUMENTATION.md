# 🔌 API Documentation - Mood IT

**Version:** 1.0.0  
**Base URL:** `/api/v1`  
**Protocol:** REST  
**Authentication:** JWT (Bearer Token)  
**Last Updated:** January 28, 2026

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Services](#services)
3. [Categories](#categories)
4. [Brands & Models](#brands--models)
5. [Bookings](#bookings)
6. [Content Management](#content-management)
7. [Settings](#settings)
8. [Users](#users)
9. [Analytics](#analytics)
10. [Error Handling](#error-handling)
11. [Rate Limiting](#rate-limiting)

---

## 1. AUTHENTICATION

### 1.1 Login
**POST** `/api/v1/auth/login`

**Request:**
```json
{
  "email": "admin@moodit.at",
  "password": "Admin123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@moodit.at",
      "full_name": "Admin User",
      "role": "admin"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIs...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
      "expires_in": 900
    }
  }
}
```

**Error (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Ungültige E-Mail oder Passwort"
  }
}
```

---

### 1.2 Refresh Token
**POST** `/api/v1/auth/refresh`

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 900
  }
}
```

---

### 1.3 Logout
**POST** `/api/v1/auth/logout`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Erfolgreich abgemeldet"
}
```

---

### 1.4 Get Current User
**GET** `/api/v1/auth/me`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "admin@moodit.at",
    "full_name": "Admin User",
    "role": "admin",
    "phone": "+43 123456789",
    "avatar_url": "https://...",
    "last_login_at": "2026-01-28T10:30:00Z"
  }
}
```

---

### 1.5 Password Reset Request
**POST** `/api/v1/auth/password-reset`

**Request:**
```json
{
  "email": "admin@moodit.at"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Passwort-Reset-Link wurde an Ihre E-Mail gesendet"
}
```

---

## 2. SERVICES

### 2.1 List All Services
**GET** `/api/v1/services`

**Query Parameters:**
- `category_id` (optional) - Filter by category UUID
- `is_active` (optional) - Filter by active status (true/false)
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20) - Items per page
- `search` (optional) - Search by name/description

**Example:** `/api/v1/services?category_id=uuid&is_active=true&page=1&limit=10`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "services": [
      {
        "id": "uuid",
        "category_id": "uuid",
        "category_name": "Telefon",
        "name_de": "Display Tausch",
        "name_en": "Display Replacement",
        "slug": "display-replacement",
        "description_de": "Professioneller Austausch...",
        "features": [
          "Original Teile",
          "12 Monate Garantie"
        ],
        "icon": "fa-solid fa-mobile-screen",
        "duration": "1-2 Stunden",
        "price_min": 79.00,
        "price_max": 199.00,
        "price_display": "€79-199",
        "is_active": true,
        "created_at": "2026-01-28T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 42,
      "total_pages": 3
    }
  }
}
```

---

### 2.2 Get Single Service
**GET** `/api/v1/services/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "category_id": "uuid",
    "category": {
      "id": "uuid",
      "name_de": "Telefon",
      "slug": "phone"
    },
    "name_de": "Display Tausch",
    "slug": "display-replacement",
    "description_de": "Professioneller Austausch...",
    "features": ["Original Teile", "12 Monate Garantie"],
    "icon": "fa-solid fa-mobile-screen",
    "duration": "1-2 Stunden",
    "price_min": 79.00,
    "price_max": 199.00,
    "price_display": "€79-199",
    "is_active": true,
    "created_at": "2026-01-28T10:00:00Z"
  }
}
```

**Error (404 Not Found):**
```json
{
  "success": false,
  "error": {
    "code": "SERVICE_NOT_FOUND",
    "message": "Service nicht gefunden"
  }
}
```

---

### 2.3 Create Service
**POST** `/api/v1/services`

**Authentication:** Required (Admin only)

**Request:**
```json
{
  "category_id": "uuid",
  "name_de": "Display Tausch",
  "name_en": "Display Replacement",
  "slug": "display-replacement",
  "description_de": "Professioneller Austausch des defekten Displays",
  "features": ["Original Teile", "12 Monate Garantie"],
  "icon": "fa-solid fa-mobile-screen",
  "duration": "1-2 Stunden",
  "price_min": 79.00,
  "price_max": 199.00,
  "price_display": "€79-199",
  "is_active": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name_de": "Display Tausch",
    "slug": "display-replacement",
    "created_at": "2026-01-28T10:00:00Z"
  },
  "message": "Service erfolgreich erstellt"
}
```

**Validation Errors (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validierungsfehler",
    "details": [
      {
        "field": "name_de",
        "message": "Name ist erforderlich"
      },
      {
        "field": "price_min",
        "message": "Mindestpreis muss größer als 0 sein"
      }
    ]
  }
}
```

---

### 2.4 Update Service
**PUT** `/api/v1/services/:id`

**Authentication:** Required (Admin only)

**Request:** (same fields as Create, all optional)
```json
{
  "name_de": "Display Tausch - Updated",
  "price_min": 89.00,
  "is_active": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name_de": "Display Tausch - Updated",
    "updated_at": "2026-01-28T11:00:00Z"
  },
  "message": "Service erfolgreich aktualisiert"
}
```

---

### 2.5 Delete Service
**DELETE** `/api/v1/services/:id`

**Authentication:** Required (Admin only)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Service erfolgreich gelöscht"
}
```

**Error (409 Conflict - has active bookings):**
```json
{
  "success": false,
  "error": {
    "code": "SERVICE_HAS_BOOKINGS",
    "message": "Service kann nicht gelöscht werden. Es gibt aktive Buchungen."
  }
}
```

---

### 2.6 Get Services by Category
**GET** `/api/v1/services/category/:slug`

**Example:** `/api/v1/services/category/phone`

**Response:** Same as "List All Services"

---

## 3. CATEGORIES

### 3.1 List All Categories
**GET** `/api/v1/categories`

**Query Parameters:**
- `is_active` (optional) - Filter by active status
- `include_services` (optional, default: false) - Include service count

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name_de": "Telefon",
      "name_en": "Phone",
      "slug": "phone",
      "icon": "fa-solid fa-mobile",
      "description_de": "Smartphone Reparatur",
      "badge": "Beliebt",
      "display_order": 1,
      "is_active": true,
      "service_count": 6
    }
  ]
}
```

---

### 3.2 Create Category
**POST** `/api/v1/categories`

**Authentication:** Required (Admin only)

**Request:**
```json
{
  "name_de": "Telefon",
  "name_en": "Phone",
  "slug": "phone",
  "icon": "fa-solid fa-mobile",
  "description_de": "Smartphone Reparatur & Service",
  "badge": "Beliebt",
  "display_order": 1,
  "is_active": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name_de": "Telefon",
    "slug": "phone"
  },
  "message": "Kategorie erfolgreich erstellt"
}
```

---

### 3.3 Update Category
**PUT** `/api/v1/categories/:id`

**Authentication:** Required (Admin only)

**Request:** (partial update)
```json
{
  "name_de": "Telefon & Smartphones",
  "display_order": 2
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Kategorie erfolgreich aktualisiert"
}
```

---

### 3.4 Delete Category
**DELETE** `/api/v1/categories/:id`

**Authentication:** Required (Admin only)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Kategorie erfolgreich gelöscht"
}
```

---

### 3.5 Reorder Categories
**PUT** `/api/v1/categories/reorder`

**Authentication:** Required (Admin only)

**Request:**
```json
{
  "order": [
    { "id": "uuid-1", "display_order": 1 },
    { "id": "uuid-2", "display_order": 2 },
    { "id": "uuid-3", "display_order": 3 }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Reihenfolge erfolgreich aktualisiert"
}
```

---

## 4. BRANDS & MODELS

### 4.1 List Brands by Category
**GET** `/api/v1/brands?category_id=:uuid`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "category_id": "uuid",
      "name": "Apple iPhone",
      "slug": "apple",
      "logo_url": "https://...",
      "display_order": 1,
      "is_active": true,
      "model_count": 12
    }
  ]
}
```

---

### 4.2 List Models by Brand
**GET** `/api/v1/models?brand_id=:uuid`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "brand_id": "uuid",
      "name": "iPhone 15 Pro",
      "slug": "iphone-15-pro",
      "release_year": 2023,
      "is_active": true
    }
  ]
}
```

---

### 4.3 Get Category Hierarchy (Categories → Brands → Models)
**GET** `/api/v1/categories/:id/hierarchy`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name_de": "Telefon",
    "slug": "phone",
    "brands": [
      {
        "id": "uuid",
        "name": "Apple iPhone",
        "slug": "apple",
        "models": [
          {
            "id": "uuid",
            "name": "iPhone 15 Pro",
            "slug": "iphone-15-pro"
          }
        ]
      }
    ]
  }
}
```

---

### 4.4 Create Brand
**POST** `/api/v1/brands`

**Authentication:** Required (Admin only)

**Request:**
```json
{
  "category_id": "uuid",
  "name": "Apple iPhone",
  "slug": "apple",
  "logo_url": "https://..."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Apple iPhone"
  },
  "message": "Marke erfolgreich erstellt"
}
```

---

### 4.5 Create Model
**POST** `/api/v1/models`

**Authentication:** Required (Admin only)

**Request:**
```json
{
  "brand_id": "uuid",
  "name": "iPhone 15 Pro",
  "slug": "iphone-15-pro",
  "release_year": 2023
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "iPhone 15 Pro"
  },
  "message": "Modell erfolgreich erstellt"
}
```

---

## 5. BOOKINGS

### 5.1 List All Bookings
**GET** `/api/v1/bookings`

**Authentication:** Required (Admin/Technician)

**Query Parameters:**
- `status` (optional) - Filter: pending, confirmed, in_progress, completed, cancelled
- `date_from` (optional) - Start date (ISO 8601)
- `date_to` (optional) - End date
- `category_id` (optional) - Filter by category
- `assigned_to` (optional) - Filter by technician UUID
- `search` (optional) - Search by customer name/phone
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "uuid",
        "booking_number": "BOOK-20260128-0001",
        "customer_name": "John Doe",
        "customer_email": "john@example.com",
        "customer_phone": "+43 123456789",
        "category": {
          "id": "uuid",
          "name_de": "Telefon"
        },
        "brand": {
          "id": "uuid",
          "name": "Apple iPhone"
        },
        "model": {
          "id": "uuid",
          "name": "iPhone 15 Pro"
        },
        "service": {
          "id": "uuid",
          "name_de": "Display Tausch"
        },
        "status": "pending",
        "estimated_price": "€149-199",
        "final_price": null,
        "booking_date": "2026-02-01T14:00:00Z",
        "customer_notes": "Screen cracked on bottom right",
        "created_at": "2026-01-28T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "total_pages": 8
    }
  }
}
```

---

### 5.2 Get Single Booking
**GET** `/api/v1/bookings/:id`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "booking_number": "BOOK-20260128-0001",
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "+43 123456789",
    "customer_whatsapp": "+43 123456789",
    "category_id": "uuid",
    "brand_id": "uuid",
    "model_id": "uuid",
    "service_id": "uuid",
    "status": "confirmed",
    "estimated_price": "€149-199",
    "final_price": 179.00,
    "booking_date": "2026-02-01T14:00:00Z",
    "confirmed_date": "2026-01-29T09:00:00Z",
    "completion_date": null,
    "customer_notes": "Screen cracked on bottom right",
    "internal_notes": "Customer will bring device tomorrow",
    "assigned_to": "uuid-technician",
    "assigned_technician": {
      "id": "uuid",
      "full_name": "Max Mustermann"
    },
    "source": "website",
    "created_at": "2026-01-28T10:30:00Z",
    "updated_at": "2026-01-29T09:00:00Z"
  }
}
```

---

### 5.3 Create Booking (Public)
**POST** `/api/v1/bookings`

**Authentication:** Not required (public endpoint)

**Request:**
```json
{
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+43 123456789",
  "customer_whatsapp": "+43 123456789",
  "category_id": "uuid",
  "brand_id": "uuid",
  "model_id": "uuid",
  "service_id": "uuid",
  "booking_date": "2026-02-01T14:00:00Z",
  "customer_notes": "Screen cracked on bottom right"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "booking_number": "BOOK-20260128-0001",
    "estimated_price": "€149-199"
  },
  "message": "Buchung erfolgreich erstellt. Sie erhalten eine Bestätigungs-E-Mail."
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "customer_phone",
        "message": "Telefonnummer ist erforderlich"
      }
    ]
  }
}
```

---

### 5.4 Update Booking Status
**PUT** `/api/v1/bookings/:id/status`

**Authentication:** Required (Admin/Technician)

**Request:**
```json
{
  "status": "confirmed",
  "internal_notes": "Customer confirmed appointment",
  "confirmed_date": "2026-02-01T14:00:00Z",
  "send_notification": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Status erfolgreich aktualisiert. Kunde wurde benachrichtigt."
}
```

---

### 5.5 Update Booking Details
**PUT** `/api/v1/bookings/:id`

**Authentication:** Required (Admin/Technician)

**Request:**
```json
{
  "final_price": 179.00,
  "internal_notes": "Replaced display and cleaned device",
  "assigned_to": "uuid-technician"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Buchung erfolgreich aktualisiert"
}
```

---

### 5.6 Cancel Booking
**DELETE** `/api/v1/bookings/:id`

**Authentication:** Required (Admin)

**Request:**
```json
{
  "reason": "Customer requested cancellation",
  "send_notification": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Buchung erfolgreich storniert"
}
```

---

## 6. CONTENT MANAGEMENT

### 6.1 Get Page Content
**GET** `/api/v1/content/:page_slug`

**Example:** `/api/v1/content/home`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "page_slug": "home",
    "sections": [
      {
        "section_key": "hero_title",
        "content_de": "Professioneller Tech-Service in Wels",
        "content_en": "Professional Tech Service in Wels",
        "content_type": "text",
        "media_url": null
      },
      {
        "section_key": "hero_image",
        "content_type": "media",
        "media_url": "https://..."
      }
    ]
  }
}
```

---

### 6.2 Get Single Section
**GET** `/api/v1/content/:page_slug/:section_key`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "page_slug": "home",
    "section_key": "hero_title",
    "content_de": "Professioneller Tech-Service in Wels",
    "content_en": "Professional Tech Service in Wels",
    "content_type": "text",
    "metadata": {
      "seo_title": "Mood IT - Professioneller Tech-Service"
    },
    "updated_at": "2026-01-28T10:00:00Z"
  }
}
```

---

### 6.3 Update Section Content
**PUT** `/api/v1/content/:page_slug/:section_key`

**Authentication:** Required (Admin only)

**Request:**
```json
{
  "content_de": "Neuer Titel",
  "content_en": "New Title",
  "metadata": {
    "seo_title": "Updated SEO Title"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Inhalt erfolgreich aktualisiert"
}
```

---

### 6.4 Upload Media
**POST** `/api/v1/content/upload`

**Authentication:** Required (Admin only)

**Request:** (multipart/form-data)
```
Content-Type: multipart/form-data

file: [binary image data]
page_slug: "home"
section_key: "hero_image"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "url": "https://supabase-storage.../hero_image.jpg",
    "size": 245680,
    "type": "image/jpeg"
  },
  "message": "Datei erfolgreich hochgeladen"
}
```

---

## 7. SETTINGS

### 7.1 Get All Settings (Public)
**GET** `/api/v1/settings/public`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "business_name": "Mood IT",
    "business_phone": "+994 50 555 55 55",
    "business_email": "info@moodit.at",
    "business_whatsapp": "+994 55 220 10 18",
    "business_address": "Wels, Österreich",
    "working_hours": {
      "monday": "09:00-18:00",
      "tuesday": "09:00-18:00",
      "wednesday": "09:00-18:00",
      "thursday": "09:00-18:00",
      "friday": "09:00-18:00",
      "saturday": "Geschlossen",
      "sunday": "Geschlossen"
    }
  }
}
```

---

### 7.2 Get All Settings (Admin)
**GET** `/api/v1/settings`

**Authentication:** Required (Admin only)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "key": "booking_email_enabled",
      "value": "true",
      "value_type": "boolean",
      "description": "Send booking confirmation emails",
      "is_public": false
    }
  ]
}
```

---

### 7.3 Update Setting
**PUT** `/api/v1/settings/:key`

**Authentication:** Required (Admin only)

**Request:**
```json
{
  "value": "+43 123 456 789"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Einstellung erfolgreich aktualisiert"
}
```

---

## 8. USERS

### 8.1 List Users
**GET** `/api/v1/users`

**Authentication:** Required (Admin only)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "admin@moodit.at",
      "full_name": "Admin User",
      "role": "admin",
      "is_active": true,
      "last_login_at": "2026-01-28T10:00:00Z"
    }
  ]
}
```

---

### 8.2 Create User
**POST** `/api/v1/users`

**Authentication:** Required (Admin only)

**Request:**
```json
{
  "email": "technician@moodit.at",
  "password": "SecurePass123!",
  "full_name": "Max Technician",
  "role": "technician",
  "phone": "+43 123456789"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "technician@moodit.at"
  },
  "message": "Benutzer erfolgreich erstellt"
}
```

---

### 8.3 Update User
**PUT** `/api/v1/users/:id`

**Authentication:** Required (Admin only)

---

### 8.4 Delete/Deactivate User
**DELETE** `/api/v1/users/:id`

**Authentication:** Required (Admin only)

---

## 9. ANALYTICS

### 9.1 Dashboard Statistics
**GET** `/api/v1/analytics/dashboard`

**Authentication:** Required (Admin)

**Query Parameters:**
- `date_from` (optional) - Start date
- `date_to` (optional) - End date (default: today)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "bookings": {
      "total": 156,
      "pending": 12,
      "confirmed": 8,
      "in_progress": 5,
      "completed": 125,
      "cancelled": 6
    },
    "revenue": {
      "total": 24580.00,
      "this_month": 4200.00,
      "last_month": 3800.00,
      "growth_percentage": 10.5
    },
    "popular_services": [
      {
        "service_id": "uuid",
        "service_name": "Display Tausch",
        "booking_count": 45
      }
    ],
    "bookings_trend": [
      { "date": "2026-01-22", "count": 5 },
      { "date": "2026-01-23", "count": 7 },
      { "date": "2026-01-24", "count": 6 }
    ]
  }
}
```

---

## 10. ERROR HANDLING

### Standard Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [] // Optional, for validation errors
  }
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource conflict (e.g., duplicate) |
| 422 | Unprocessable Entity - Invalid data |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

### Common Error Codes

- `INVALID_CREDENTIALS` - Login failed
- `TOKEN_EXPIRED` - JWT token expired
- `VALIDATION_ERROR` - Input validation failed
- `NOT_FOUND` - Resource not found
- `UNAUTHORIZED` - No auth token provided
- `FORBIDDEN` - Insufficient permissions
- `DUPLICATE_ENTRY` - Resource already exists
- `RATE_LIMIT_EXCEEDED` - Too many requests

---

## 11. RATE LIMITING

**Limits:**
- **Public endpoints**: 100 requests per 15 minutes per IP
- **Authenticated endpoints**: 1000 requests per 15 minutes per user

**Response Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1706437200
```

**Rate Limit Exceeded (429):**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Zu viele Anfragen. Bitte versuchen Sie es später erneut.",
    "retry_after": 900
  }
}
```

---

**API Version:** 1.0.0  
**Last Updated:** January 28, 2026  
**Contact:** dev@moodit.at

---

© 2026 Mood IT - Confidential