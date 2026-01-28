# 🎨 Admin Panel Specifications - Mood IT

**Version:** 1.0.0  
**Framework:** Next.js 14 + TypeScript  
**UI Library:** Material-UI v5  
**Last Updated:** January 28, 2026

---

## 📋 Table of Contents

1. [Design System](#design-system)
2. [Layout Structure](#layout-structure)
3. [Pages & Features](#pages--features)
4. [Components](#components)
5. [User Flows](#user-flows)
6. [Responsive Design](#responsive-design)
7. [Accessibility](#accessibility)

---

## 1. DESIGN SYSTEM

### 1.1 Brand Colors

```css
/* Primary Colors */
--primary-purple: #8a4fff;
--primary-blue: #4185DD;
--primary-pink: #B42FDA;

/* Gradients */
--gradient-primary: linear-gradient(135deg, #4185DD 0%, #B42FDA 100%);
--gradient-purple: linear-gradient(135deg, #8a4fff 0%, #B42FDA 100%);

/* Background Colors */
--bg-dark: #1C1B2B;
--bg-secondary: #252435;
--bg-tertiary: #2D2C3D;
--bg-white: #FFFFFF;

/* Text Colors */
--text-primary: #FFFFFF;
--text-secondary: #D1D1D1;
--text-muted: #9E9E9E;
--text-dark: #1C1B2B;

/* Status Colors */
--success: #4CAF50;
--warning: #FF9800;
--error: #F44336;
--info: #2196F3;

/* Border & Divider */
--border-color: #3A3949;
--divider-color: #3A3949;
```

### 1.2 Typography

**Font Family:**
```css
--font-primary: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Font Sizes:**
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

**Font Weights:**
```css
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### 1.3 Spacing Scale

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
--spacing-3xl: 64px;
```

### 1.4 Border Radius

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 24px;
--radius-full: 9999px;
```

### 1.5 Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.15);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.2);
--shadow-glow: 0 0 20px rgba(138, 79, 255, 0.4);
```

---

## 2. LAYOUT STRUCTURE

### 2.1 Main Layout Components

```
┌─────────────────────────────────────────────────┐
│                   TopBar                        │ (64px height)
├──────────┬──────────────────────────────────────┤
│          │                                      │
│          │                                      │
│ Sidebar  │         Page Content                │
│          │                                      │
│ (260px)  │                                      │
│          │                                      │
│          │                                      │
└──────────┴──────────────────────────────────────┘
```

### 2.2 TopBar

**Components:**
- Logo (left)
- Breadcrumbs (center)
- Search bar (global search)
- Notifications icon + badge
- User avatar + dropdown menu

**Height:** 64px  
**Background:** `--bg-secondary`  
**Border bottom:** 1px solid `--border-color`

**User Dropdown Menu:**
- Profile
- Settings
- Logout

### 2.3 Sidebar

**Width:** 260px (expanded), 80px (collapsed)  
**Background:** `--bg-dark`  
**Position:** Fixed left

**Navigation Items:**
```
📊 Dashboard             → /admin
📦 Services              → /admin/services
📁 Categories            → /admin/categories
🏷️ Brands & Models       → /admin/brands
📋 Bookings              → /admin/bookings
📝 Content               → /admin/content
⚙️ Settings              → /admin/settings
👥 Users                 → /admin/users
```

**Navigation Item States:**
- Default: Gray text, no background
- Hover: Light background (`--bg-secondary`)
- Active: Gradient background + white text + left border (purple)

**Collapse Button:**
- Position: Bottom of sidebar
- Icon: Chevron left/right
- Toggle width between 260px ↔ 80px

### 2.4 Page Content Area

**Padding:** 24px  
**Background:** `--bg-tertiary`  
**Max width:** 100% (fluid)

**Standard Page Structure:**
```tsx
<PageHeader>
  <Title>Page Title</Title>
  <Actions>
    <Button>Primary Action</Button>
  </Actions>
</PageHeader>

<PageContent>
  {/* Filters, Tables, Forms, etc. */}
</PageContent>
```

---

## 3. PAGES & FEATURES

### 3.1 Dashboard (`/admin`)

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  Statistics Cards (4 cards in a row)           │
├──────────────────────┬──────────────────────────┤
│  Bookings Trend      │  Popular Services        │
│  (Line Chart)        │  (Pie Chart)             │
├──────────────────────┴──────────────────────────┤
│  Recent Bookings (Table - Last 10)             │
└─────────────────────────────────────────────────┘
```

**Statistics Cards:**
1. **Total Bookings**
   - Icon: 📋
   - Value: 156 (large number)
   - Change: +12% vs last month (green arrow)

2. **Pending Bookings**
   - Icon: ⏳
   - Value: 12
   - CTA: "View All" button

3. **Revenue This Month**
   - Icon: 💰
   - Value: €4,200
   - Change: +10.5% vs last month

4. **Active Services**
   - Icon: ⚡
   - Value: 42
   - CTA: "Manage" button

**Bookings Trend Chart:**
- Type: Line chart (Chart.js / Recharts)
- X-axis: Last 30 days
- Y-axis: Booking count
- Data: Daily bookings

**Popular Services Chart:**
- Type: Doughnut chart
- Data: Top 6 services by booking count
- Colors: Brand gradient colors

**Recent Bookings Table:**
- Columns: Booking #, Customer, Service, Status, Date, Actions
- Rows: Last 10 bookings
- Actions: View, Update Status
- Real-time updates (optional with Supabase subscriptions)

---

### 3.2 Services Management (`/admin/services`)

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  Page Header                                    │
│  Title: "Services" | Add Service Button        │
├─────────────────────────────────────────────────┤
│  Filters: Category | Status | Search           │
├─────────────────────────────────────────────────┤
│  Data Grid (MUI DataGrid)                      │
│  - Name | Category | Price | Duration | Active │
│  - Actions: Edit | Delete | Duplicate          │
├─────────────────────────────────────────────────┤
│  Pagination: Page 1 of 3 | 20 per page         │
└─────────────────────────────────────────────────┘
```

**Filters:**
- Category (dropdown) - All, Telefon, PlayStation, etc.
- Status (toggle) - Active / Inactive / All
- Search (text input) - Search by name/description

**Data Grid Columns:**
1. **Name** (sortable)
   - German name (bold)
   - English name (muted, small)
2. **Category** (chip with icon)
3. **Price** (€79-199)
4. **Duration** (1-2 Stunden)
5. **Status** (toggle switch - Active/Inactive)
6. **Actions** (icon buttons)
   - ✏️ Edit
   - 🗑️ Delete (with confirmation dialog)
   - 📋 Duplicate

**Bulk Actions:**
- Checkbox in each row
- Top bar appears when items selected
- Actions: Delete, Activate, Deactivate

**Add/Edit Service Modal:**
- Modal size: 700px width
- Tabs: General | Pricing | Advanced

**Tab 1: General**
```
┌─────────────────────────────────────┐
│ Category *          [Dropdown ▼]    │
│ Name (German) *     [_____________] │
│ Name (English)      [_____________] │
│ Slug *              [auto-generated]│
│ Icon *              [fa-selector]   │
│ Description (DE) *  [Rich Text ▼]  │
│ Description (EN)    [Rich Text ▼]  │
│ Features            [+ Add Feature] │
│   • Feature 1       [x Remove]      │
│   • Feature 2       [x Remove]      │
└─────────────────────────────────────┘
```

**Tab 2: Pricing**
```
┌─────────────────────────────────────┐
│ Price Range                          │
│ Minimum Price *   [___] €            │
│ Maximum Price *   [___] €            │
│ Display Format    [€79-199]          │
│                                      │
│ Duration *        [1-2 Stunden]      │
│                                      │
│ Status            [x] Active         │
└─────────────────────────────────────┘
```

**Tab 3: Advanced**
- Display Order (drag handle in list view)
- SEO fields (future)
- Related services (future)

**Validation:**
- Name (DE) required
- Category required
- Price min > 0, Price max > Price min
- Slug unique

---

### 3.3 Categories Management (`/admin/categories`)

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  Page Header: "Categories" | Add Category      │
├─────────────────────────────────────────────────┤
│  Sortable List (Drag & Drop)                   │
│  ┌───────────────────────────────────────────┐ │
│  │ ≡ 📱 Telefon                   [42] Edit  │ │
│  └───────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────┐ │
│  │ ≡ 🎮 PlayStation                [28] Edit │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**List Item Components:**
- Drag handle (≡)
- Icon preview
- Name (German) + Badge (if any)
- Service count in parentheses
- Active/Inactive toggle
- Edit button
- Delete button (disabled if has services)

**Add/Edit Category Form:**
```
┌─────────────────────────────────────┐
│ Name (German) *     [_____________] │
│ Name (English)      [_____________] │
│ Slug *              [auto-generated]│
│ Icon *              [fa-selector]   │
│ Description (DE)    [Text Area]     │
│ Badge (optional)    [Beliebt ▼]    │
│ Status              [x] Active      │
│                                      │
│ [Cancel] [Save]                     │
└─────────────────────────────────────┘
```

**Icon Selector Component:**
- Modal with searchable FontAwesome icons
- Preview selected icon
- Common icons shortcuts (mobile, laptop, etc.)

---

### 3.4 Brands & Models (`/admin/brands`)

**Layout: Tree Structure**
```
┌─────────────────────────────────────────────────┐
│  Category Selector: [Telefon ▼]                │
├─────────────────────────────────────────────────┤
│  ▼ Apple iPhone                     [Edit] [+]  │
│    • iPhone 15 Pro Max              [Edit] [x]  │
│    • iPhone 15 Pro                  [Edit] [x]  │
│    • iPhone 15                      [Edit] [x]  │
│  ▼ Samsung Galaxy                   [Edit] [+]  │
│    • Galaxy S24 Ultra               [Edit] [x]  │
│    • Galaxy S24                     [Edit] [x]  │
└─────────────────────────────────────────────────┘
```

**Features:**
- Collapsible brand sections
- Add model button per brand (+ icon)
- Edit/Delete actions per item
- Bulk import (CSV) - future

**Add Brand Form:**
```
┌─────────────────────────────────────┐
│ Category *          [Dropdown ▼]    │
│ Brand Name *        [_____________] │
│ Slug *              [auto-generated]│
│ Logo Upload         [Choose File]   │
│ Status              [x] Active      │
└─────────────────────────────────────┘
```

**Add Model Form:**
```
┌─────────────────────────────────────┐
│ Brand *             [Dropdown ▼]    │
│ Model Name *        [_____________] │
│ Slug *              [auto-generated]│
│ Release Year        [2023]          │
│ Status              [x] Active      │
└─────────────────────────────────────┘
```

---

### 3.5 Bookings Management (`/admin/bookings`)

**View Modes:**
- Table View (default)
- Calendar View (optional)
- Kanban Board (optional)

**Table View Layout:**
```
┌─────────────────────────────────────────────────┐
│  Filters: Status | Date Range | Category |      │
│  Search: Customer Name/Phone                    │
├─────────────────────────────────────────────────┤
│  Status Tabs:                                   │
│  [All: 156] [Pending: 12] [Confirmed: 8] ...   │
├─────────────────────────────────────────────────┤
│  Data Grid                                      │
│  Booking # | Customer | Service | Status | ...  │
└─────────────────────────────────────────────────┘
```

**Status Tabs (Quick Filters):**
- All (156)
- Pending (12) - Orange badge
- Confirmed (8) - Blue badge
- In Progress (5) - Purple badge
- Completed (125) - Green badge
- Cancelled (6) - Gray badge

**Data Grid Columns:**
1. Booking Number (link to details)
2. Customer Name + Phone
3. Device (Category + Brand + Model)
4. Service
5. Status (chip with color)
6. Booking Date
7. Final Price
8. Actions (View, Update Status)

**Booking Details Drawer:**
- Slide from right (600px width)
- Sections: Customer Info, Device Info, Service Details, Status History, Notes

**Customer Info Section:**
```
┌─────────────────────────────────────┐
│ 👤 Customer Information             │
├─────────────────────────────────────┤
│ Name:      John Doe                 │
│ Email:     john@example.com         │
│ Phone:     +43 123456789            │
│ WhatsApp:  +43 123456789            │
│ [📧 Send Email] [💬 WhatsApp]       │
└─────────────────────────────────────┘
```

**Status Update Component:**
```
┌─────────────────────────────────────┐
│ Current Status: Pending             │
│ Update Status:  [Confirmed ▼]       │
│ Confirmed Date: [Date Picker]       │
│ Internal Notes: [Text Area]         │
│ [ ] Send notification to customer   │
│                                      │
│ [Cancel] [Update Status]            │
└─────────────────────────────────────┘
```

**Status Timeline:**
```
┌─────────────────────────────────────┐
│ Status History                      │
├─────────────────────────────────────┤
│ ● Completed          Jan 30, 15:00  │
│ │ Final price: €179                 │
│ │                                    │
│ ● In Progress        Jan 29, 10:00  │
│ │ Started repair                    │
│ │                                    │
│ ● Confirmed          Jan 28, 14:00  │
│ │ Appointment confirmed             │
│ │                                    │
│ ● Created            Jan 28, 10:30  │
└─────────────────────────────────────┘
```

---

### 3.6 Content Management (`/admin/content`)

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  Page Selector: [Home ▼]                       │
├──────────────────────┬──────────────────────────┤
│  Section List        │  Content Editor          │
│  ┌──────────────┐   │  ┌──────────────────┐   │
│  │ Hero Title   │   │  │ Rich Text Editor │   │
│  │ Hero Subtitle│   │  │                  │   │
│  │ About Section│   │  │ [Preview Mode]   │   │
│  └──────────────┘   │  └──────────────────┘   │
│                      │  [Save Changes]          │
└──────────────────────┴──────────────────────────┘
```

**Page Selector:**
- Dropdown: Home, About, Contact, Service Pages
- Shows: Page name + last updated

**Section List (Left Panel - 300px):**
- Searchable list
- Click to load in editor
- Shows: Section name + content type icon

**Content Editor (Right Panel):**

**For Text/HTML:**
- Rich Text Editor (TinyMCE or Quill)
- Toolbar: Bold, Italic, Headings, Lists, Links, etc.
- Language tabs: German | English
- Character count

**For Media:**
- Image upload (drag & drop)
- Image preview
- Alt text field
- URL field (for external images)

**Editor Actions:**
- Preview button (opens modal with iframe)
- Save button (primary)
- Discard changes

**SEO Section (Expandable):**
```
┌─────────────────────────────────────┐
│ ▼ SEO Settings                      │
├─────────────────────────────────────┤
│ Meta Title       [_________________]│
│ Meta Description [Text Area______]  │
│ Keywords (tags)  [tag1] [tag2] [+] │
└─────────────────────────────────────┘
```

---

### 3.7 Settings (`/admin/settings`)

**Layout: Tabs**

**Tab 1: Business Information**
```
┌─────────────────────────────────────┐
│ Company Name *      [Mood IT]       │
│ Phone Number *      [+43 12345678]  │
│ Email *             [info@moodit.at]│
│ WhatsApp            [+994 55 220...]│
│ Address             [Wels, Österr.]│
│                                      │
│ Working Hours                        │
│ Monday      [09:00] - [18:00]       │
│ Tuesday     [09:00] - [18:00]       │
│ ...                                  │
│ [x] Closed on Sundays               │
└─────────────────────────────────────┘
```

**Tab 2: Email Settings**
```
┌─────────────────────────────────────┐
│ Email Provider      [SendGrid ▼]    │
│ API Key             [••••••••••]    │
│ From Email *        [no-reply@...]  │
│ From Name           [Mood IT]       │
│                                      │
│ Email Templates                      │
│ • Booking Confirmation [Edit]       │
│ • Status Update        [Edit]       │
│ • Password Reset       [Edit]       │
│                                      │
│ Test Email          [Send Test]     │
└─────────────────────────────────────┘
```

**Tab 3: Notifications**
```
┌─────────────────────────────────────┐
│ [x] Send booking confirmation emails│
│ [x] Notify admin on new bookings    │
│ [ ] Send SMS notifications (future) │
│                                      │
│ Admin Email         [admin@mood...] │
└─────────────────────────────────────┘
```

**Tab 4: System**
```
┌─────────────────────────────────────┐
│ Default Language    [German ▼]      │
│ Currency            [EUR ▼]         │
│ Timezone            [Europe/Vienna] │
│ Date Format         [DD.MM.YYYY]    │
│                                      │
│ Maintenance Mode                     │
│ [ ] Enable maintenance mode         │
│ Message: [Text Area]                │
└─────────────────────────────────────┘
```

---

### 3.8 Users Management (`/admin/users`)

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  Page Header: "Users" | Add User               │
├─────────────────────────────────────────────────┤
│  Filters: Role | Status                         │
├─────────────────────────────────────────────────┤
│  Data Grid                                      │
│  Avatar | Name | Email | Role | Status | Actions│
└─────────────────────────────────────────────────┘
```

**Data Grid Columns:**
1. Avatar (circular image)
2. Full Name
3. Email
4. Role (chip: Admin/Technician)
5. Last Login
6. Status (Active/Inactive toggle)
7. Actions (Edit, Delete)

**Add/Edit User Form:**
```
┌─────────────────────────────────────┐
│ Full Name *         [_____________] │
│ Email *             [_____________] │
│ Phone               [_____________] │
│ Role *              [Admin ▼]       │
│ Password *          [_____________] │
│ Confirm Password *  [_____________] │
│ Avatar              [Upload Image]  │
│ Status              [x] Active      │
└─────────────────────────────────────┘
```

---

## 4. COMPONENTS

### 4.1 Reusable Components Library

#### Button Component
```tsx
<Button variant="primary | secondary | outline | text">
  Label
</Button>
```

**Variants:**
- Primary: Gradient background, white text
- Secondary: Solid purple, white text
- Outline: Transparent, purple border
- Text: No background, purple text

**Sizes:** small, medium, large  
**States:** default, hover, active, disabled, loading

---

#### Card Component
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardActions>
      <Button>Action</Button>
    </CardActions>
  </CardHeader>
  <CardContent>
    {children}
  </CardContent>
</Card>
```

**Props:**
- `elevation` (0-3)
- `padding` (sm, md, lg)
- `hoverable` (boolean)

---

#### Status Chip Component
```tsx
<StatusChip status="pending | confirmed | completed">
  Label
</StatusChip>
```

**Colors:**
- Pending: Orange
- Confirmed: Blue
- In Progress: Purple
- Completed: Green
- Cancelled: Gray

---

#### Empty State Component
```tsx
<EmptyState
  icon={<SearchOffIcon />}
  title="No results found"
  description="Try adjusting your filters"
  action={<Button>Clear Filters</Button>}
/>
```

---

#### Confirmation Dialog
```tsx
<ConfirmDialog
  open={open}
  title="Delete Service?"
  message="This action cannot be undone."
  confirmText="Delete"
  confirmColor="error"
  onConfirm={handleDelete}
  onCancel={handleCancel}
/>
```

---

#### Toast Notification
```tsx
showToast({
  type: 'success | error | warning | info',
  message: 'Service created successfully',
  duration: 3000
});
```

---

## 5. USER FLOWS

### 5.1 Create Service Flow

1. Admin clicks "Add Service" button
2. Modal opens with 3-tab form
3. Admin fills:
   - Tab 1: Name, Category, Description, Features
   - Tab 2: Pricing, Duration
   - Tab 3: Status
4. Form validation (client-side)
5. Admin clicks "Save"
6. API call to `/api/services` (POST)
7. Loading spinner on button
8. On success:
   - Modal closes
   - Toast: "Service created successfully"
   - Table refreshes with new item
9. On error:
   - Toast: Error message
   - Form stays open

### 5.2 Update Booking Status Flow

1. Admin opens booking details drawer
2. Clicks "Update Status"
3. Selects new status from dropdown
4. (Optional) Adds internal notes
5. Toggles "Send notification" checkbox
6. Clicks "Update Status" button
7. API call to `/api/bookings/:id/status` (PUT)
8. On success:
   - Drawer updates
   - Status timeline updated
   - Email sent to customer (if enabled)
   - Toast: "Status updated"
10. On error:
    - Toast: Error message

---

## 6. RESPONSIVE DESIGN

### 6.1 Breakpoints

```css
/* Mobile First */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### 6.2 Responsive Behavior

**Mobile (<768px):**
- Sidebar hidden (hamburger menu)
- TopBar: Logo + Menu icon + User icon
- Tables: Scroll horizontally OR card view
- Forms: Full width, single column
- Modals: Full screen

**Tablet (768px - 1024px):**
- Sidebar collapsed (80px, icons only)
- Tables: All columns visible
- Forms: 2-column layout where appropriate
- Modals: 90% width

**Desktop (>1024px):**
- Sidebar expanded (260px)
- All features visible
- Optimal spacing
- Modals: Fixed width (700px, 900px)

---

## 7. ACCESSIBILITY

### 7.1 WCAG 2.1 AA Compliance

**Color Contrast:**
- Text on background: Minimum 4.5:1
- Large text (18pt+): Minimum 3:1
- UI components: Minimum 3:1

**Keyboard Navigation:**
- All interactive elements focusable
- Tab order logical
- Focus indicators visible (purple ring)
- Escape key closes modals
- Enter key submits forms

**Screen Reader Support:**
- ARIA labels on icons
- ARIA live regions for notifications
- ARIA expanded states for dropdowns
- Alt text on images
- Form labels properly associated

**Forms:**
- Clear error messages
- Error summary at top
- Required field indicators
- Fieldset for related inputs

---

## 8. PERFORMANCE

### 8.1 Optimization Strategies

**Code Splitting:**
- Route-based code splitting (Next.js automatic)
- Component lazy loading
- Dynamic imports for heavy components

**Data Loading:**
- Pagination (20 items per page)
- Infinite scroll (optional)
- Debounced search (500ms)
- Cached API responses (React Query)

**Images:**
- Lazy loading
- Next.js Image component
- WebP format
- Responsive images

**Bundle Size:**
- Tree shaking (automatic)
- Avoid large dependencies
- Icon subset (only used FontAwesome icons)

---

## 9. TECHNOLOGY STACK

### 9.1 Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@mui/material": "^5.15.0",
    "@mui/icons-material": "^5.15.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "@tanstack/react-query": "^5.0.0",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.0",
    "@supabase/supabase-js": "^2.38.0",
    "recharts": "^2.10.0",
    "date-fns": "^3.0.0",
    "zustand": "^4.4.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.10.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0"
  }
}
```

---

**Document Version:** 1.0.0  
**Last Updated:** January 28, 2026  
**Designer:** Mood IT Dev Team

---

© 2026 Mood IT - Confidential