# Admin Dashboard Implementation Guide

## Overview

A fully functional, dynamic admin dashboard for the NextGen Coders platform with advanced state management using TanStack Query (React Query), real-time notifications using Sonner, and comprehensive API endpoints for course, order, and student management.

---

## Core Features Implemented

### 1. **State Management with TanStack Query**

- Centralized data fetching and caching
- Automatic background refetching
- Optimistic updates and mutations
- Real-time toast notifications for user actions

### 2. **Dashboard Statistics (6 Stat Cards)**

- **Total Orders**: Count of all orders
- **Total Revenue**: Sum of approved orders
- **Approved Orders**: Count of approved orders
- **Pending Orders**: Count of pending orders
- **Total Students**: Unique student count from orders
- **Courses**: Number of available courses

### 3. **Tab-Based Interface**

#### Overview Tab

- Recent orders display (5 latest)
- Quick status indicators
- Color-coded badges (pending/approved/declined)

#### Orders Tab

- Complete orders table with search and filtering
- Dynamic data from `/api/orders`
- Status color coding and icons
- Quick actions (View details)
- Real-time filtering by status and keywords

#### Students Tab

- Student list with email and enrollment info
- Status-based approval/decline buttons
- Direct action buttons for pending students
- Automatic status updates with mutations

#### Courses Tab

- Create new courses with title, price, and video URL
- List all courses with timestamps
- Delete courses with confirmation
- Direct integration with `/api/courses` endpoint

#### Videos Tab

- Add course videos with YouTube links
- List videos organized by course
- Watch button for quick access
- Delete videos with loading states

### 4. **API Endpoints**

#### `/api/orders` (GET)

```json
{
  "method": "GET",
  "response": [
    {
      "id": "uuid",
      "order_id": "uuid",
      "course_name": "string",
      "user_id_value": "string",
      "user_email": "string",
      "user_password": "string",
      "screenshot_url": "string",
      "status": "pending|approved|declined",
      "admin_notes": "string|null",
      "created_at": "timestamp"
    }
  ]
}
```

#### `/api/students` (GET/PATCH)

```json
{
  "GET": {
    "response": [
      {
        "id": "string",
        "email": "string",
        "status": "pending|approved|declined",
        "created_at": "timestamp"
      }
    ]
  },
  "PATCH": {
    "body": {
      "id": "string",
      "action": "approve|decline"
    },
    "response": {
      "message": "Student approved/declined successfully"
    }
  }
}
```

#### `/api/courses` (GET/POST/DELETE)

```json
{
  "GET": {
    "response": [
      {
        "id": "uuid",
        "title": "string",
        "description": "string",
        "price": "number",
        "created_at": "timestamp"
      }
    ]
  },
  "POST": {
    "body": {
      "title": "string",
      "price": "number",
      "videoUrl": "string"
    }
  },
  "DELETE": {
    "params": "?id=uuid"
  }
}
```

#### `/api/videos` (GET/POST/DELETE)

```json
{
  "GET": {
    "response": [
      {
        "id": "uuid",
        "course_name": "string",
        "title": "string",
        "youtube_url": "string",
        "order_index": "number",
        "created_at": "timestamp"
      }
    ]
  },
  "POST": {
    "body": {
      "course_name": "string",
      "title": "string",
      "youtube_url": "string"
    }
  },
  "DELETE": {
    "params": "?id=uuid"
  }
}
```

---

## Technical Stack

### Dependencies

- **@tanstack/react-query**: Advanced state management
- **sonner**: Toast notifications
- **lucide-react**: Icons
- **@supabase/supabase-js**: Database integration
- **shadcn/ui**: UI components

### Database Tables

- `order_submissions`: Order records and verification
- `students` (derived from orders)
- `courses`: Course metadata
- `course_videos`: Video content links

---

## Component Structure

```
AdminDashboardPage
├── Header (with Logout)
├── Dashboard Stats (6 cards)
├── Tabs
│   ├── Overview
│   │   └── Recent Orders
│   ├── Orders
│   │   ├── Search & Filter
│   │   └── Orders Table
│   ├── Students
│   │   └── Students Table with Actions
│   ├── Courses
│   │   ├── Add Course Form
│   │   └── Courses List
│   └── Videos
│       ├── Add Video Form
│       └── Videos List
├── Dialogs
│   ├── View Submission Modal
│   ├── Edit Modal (disabled)
│   └── Delete Confirmation Modal
```

---

## Key Features

### Real-Time Updates

- Automatic cache invalidation on mutations
- Optimistic updates for smooth UX
- Background refetching

### Toast Notifications

- Success notifications for all complete actions
- Error notifications with error messages
- Info notifications for user guidance

### Responsive Design

- Mobile-friendly tables with horizontal scrolling
- Responsive grid layouts
- Touch-friendly buttons and controls

### Data Integrity

- Protected admin routes with token validation
- Session-based authentication check
- Admin token stored in localStorage

### Loading States

- Loading spinners for initial data fetch
- Button loading indicators for mutations
- Table skeleton with "Loading..." message

---

## Usage Instructions

### Login

1. Navigate to `/admin/login`
2. Enter password: `nextgen1234567890`
3. Token stored in localStorage automatically

### Managing Orders

1. View all orders in the "Orders" tab
2. Click "Eye" icon to view order details
3. Approve or decline pending orders
4. Add admin notes before taking action

### Managing Students

1. Go to "Students" tab
2. See all students with their enrollment status
3. For pending students, click "Approve" or "Decline"
4. Status updates automatically

### Managing Courses

1. Go to "Courses" tab
2. Click "Add Course" button
3. Enter title, price, and video URL
4. Course appears in the list immediately
5. Delete unwanted courses

### Managing Videos

1. Go to "Videos" tab
2. Click "Add Video" button
3. Select course, enter title and YouTube URL
4. Video added to the selected course
5. Watch button opens video in new tab

---

## Data Flow

1. **Initial Load**: useQuery fetches orders, students, courses, videos
2. **User Action**: Admin performs action (approve, create, delete)
3. **Mutation**: useMutation sends request to API
4. **Cache Invalidation**: queryClient invalidates related queries
5. **Refetch**: useQuery automatically refetches updated data
6. **UI Update**: Component re-renders with new data
7. **Toast Notification**: User feedback displayed

---

## Error Handling

All mutations include:

- Try-catch error blocks
- Toast error notifications
- Console logging for debugging
- User-friendly error messages

---

## Future Enhancements

1. Edit submission functionality with API
2. Bulk actions for multiple orders
3. Advanced analytics charts
4. Export data to CSV/PDF
5. Email notifications to students
6. Role-based admin permissions
7. Activity logs and audit trail
8. Student performance tracking

---

## Notes

- Admin password: `nextgen1234567890` (stored in `/api/admin/login`)
- All data persisted in Supabase
- Real-time updates via mutations with cache invalidation
- Logout clears session and redirects to login page
