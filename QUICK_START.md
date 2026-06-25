# Quick Start Guide - Admin Dashboard

## Access the Admin Dashboard

### Step 1: Start the Development Server

```bash
npm run dev
```

Server starts on port 3000 (or 3001 if 3000 is in use)

### Step 2: Navigate to Admin Login

Open browser and go to:

```
http://localhost:3000/admin/login
```

### Step 3: Login with Admin Credentials

- **Password:** `NextGen1234567890`
- Click "Login"

### Step 4: Access Dashboard

You'll be redirected to:

```
http://localhost:3000/admin/dashboard
```

---

## Dashboard Tabs Overview

### 📊 Overview Tab

**Purpose:** Quick dashboard at a glance

- 6 stat cards (Orders, Revenue, Approved, Pending, Students, Courses)
- 5 most recent orders
- Real-time status indicators

### 📋 Orders Tab

**Purpose:** Manage all student orders

- **Search:** By course name, student ID, or email
- **Filter:** By status (All, Pending, Approved, Declined)
- **Actions:**
  - 👁️ View order details
  - ✓ Approve order
  - ✗ Decline order
  - Add admin notes

### 👥 Students Tab

**Purpose:** Manage course enrollment requests

- See all students with email and join date
- For pending students:
  - ✓ Click Approve to accept enrollment
  - ✗ Click Decline to reject enrollment
- Status updates automatically
- Stat cards update in real-time

### 📚 Courses Tab

**Purpose:** Create and manage course offerings

- **Add Course:**
  1. Click "Add Course" button
  2. Enter course title
  3. Enter course price (₹)
  4. Paste YouTube intro video URL
  5. Click "Create Course"
- **Delete Course:** Click "Delete" on any course

### 🎥 Videos Tab

**Purpose:** Manage course video content

- **Add Video:**
  1. Click "Add Video" button
  2. Select course from dropdown
  3. Enter video title
  4. Paste YouTube video URL
  5. Click "Add Video"
- **Watch Video:** Click "Watch" button (opens in new tab)
- **Delete Video:** Click "Delete" button

---

## Common Tasks

### Approve a Student Order

1. Go to **Orders** tab
2. Click the 👁️ icon on the pending order
3. Review order details and screenshot
4. Add notes if needed (optional)
5. Click "Approve" button
6. See toast notification: "Student approved successfully"
7. Order status changes to ✓ Approved (green)

### Create a New Course

1. Go to **Courses** tab
2. Click "Add Course" button
3. Enter:
   - **Title:** e.g., "Advanced JavaScript"
   - **Price:** e.g., 2999 (in rupees)
   - **Video URL:** YouTube video intro link
4. Press "Create Course"
5. See toast: "Course created successfully"
6. New course appears in the list

### Add Course Video

1. Go to **Videos** tab
2. Click "Add Video" button
3. Select course from dropdown
4. Enter video title (e.g., "Module 1: Fundamentals")
5. Paste YouTube video URL
6. Click "Add Video"
7. See toast: "Video added successfully"
8. Video appears in the list

### Decline Student Request

1. Go to **Students** tab
2. Find student with "pending" status
3. Click the ✗ (red X) button
4. See toast: "Student declined successfully"
5. Status changes to ✗ Declined (red)

---

## UI Indicators

### Status Badges

- 🟡 **Pending** (Yellow) - Awaiting approval
- 🟢 **Approved** (Green) - Completed successfully
- 🔴 **Declined** (Red) - Rejected

### Action Icons

- 👁️ **Eye** - View details
- ✓ **Check** - Approve
- ✗ **X** - Decline
- 🗑️ **Trash** - Delete
- ➕ **Plus** - Add new item

### Toast Notifications

- 🟢 Green: Success messages
- 🔴 Red: Error messages
- 🔵 Blue: Info messages
- Auto-dismiss after 3 seconds

---

## Data That Auto-Updates

When you perform any action (approve, create, delete):

1. ✓ Stat cards update instantly
2. ✓ Tables refresh with new data
3. ✓ Status badges change color
4. ✓ Lists reorganize automatically
5. ✓ Toast confirms the action

**No page reload needed!**

---

## Tips & Tricks

1. **Search Orders:** Type part of course name or student email
2. **Quick Actions:** Status filter shows only what you need
3. **Watch Videos:** Click "Watch" to preview before approving
4. **Batch Approvals:** Use filter to see all pending at once
5. **Add Notes:** Write notes before approving each order
6. **Dark Mode:** Dashboard is dark-themed (no toggle needed)

---

## Troubleshooting

### Page Shows "Loading..." Indefinitely

- Check admin token: `localStorage.getItem('adminToken')`
- Refresh page
- Clear cache and login again

### API Errors in Toast

- Check Supabase connection
- Verify API route is accessible
- Check browser console (F12)

### Sorting Not Working

- Sorting done server-side in query
- Refresh page to see updates
- Use search/filter for quick access

### Image/Video Not Loading

- Verify YouTube URL is correct
- Check internet connection
- Wait for Supabase to process

---

## Features at a Glance

| Feature             | Tab      | Status     |
| ------------------- | -------- | ---------- |
| View Orders         | Orders   | ✅ Working |
| Approve/Decline     | Students | ✅ Working |
| Create Courses      | Courses  | ✅ Working |
| Delete Courses      | Courses  | ✅ Working |
| Add Videos          | Videos   | ✅ Working |
| Delete Videos       | Videos   | ✅ Working |
| Real-time Stats     | Overview | ✅ Working |
| Search & Filter     | Orders   | ✅ Working |
| Toast Notifications | All      | ✅ Working |
| Logout              | Header   | ✅ Working |

---

## Logout & Session

Click **Logout** button in top right to:

1. Clear admin token from localStorage
2. Redirect to login page
3. Session ends

Your approval history is preserved in Supabase.

---

## Need Help?

- Check browser developer tools (F12)
- Look at Network tab for API calls
- Find error messages in Console
- Compare with API documentation in ADMIN_DASHBOARD_GUIDE.md

---

**Developed:** April 1, 2026  
**Framework:** Next.js 13  
**Database:** Supabase (PostgreSQL)  
**State Management:** TanStack Query  
**Notifications:** Sonner
