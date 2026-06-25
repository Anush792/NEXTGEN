# Admin Panel - Complete Functionality Guide

## Overview

The admin panel is now **fully functional** with complete course management and student acceptance workflow.

---

## 📊 Dashboard Features

### 1. **Overview Tab**

- **Real-time Statistics**:
  - Total Orders
  - Total Revenue
  - Pending Orders
  - Total Courses
- **Recent Orders**: Quick view of latest enrollments
- **Website Settings Preview**: WhatsApp, email, course count, student count, QR code

### 2. **Orders Tab** (Student Enrollment Management)

- **Search & Filter**: Find orders by course name, email, or user ID
- **Status Filter**: pending, completed, rejected
- **Order Actions**:
  - ✅ Accept Student (Approve enrollment)
  - ❌ Decline Student (Reject enrollment)
  - 📝 Add Admin Notes for feedback

**Workflow**:

1. Student purchases/enrolls in course
2. Order appears as "Pending" in Orders tab
3. Admin reviews order details and payment proof
4. Admin clicks "Accept Student" or "Decline Student"
5. Student receives notification and can accept/decline on their side

### 3. **Courses Tab** ⭐ NEW

- **Add Course**: Create new courses with:
  - Course Title (required)
  - Description
  - Category: Web Development, Mobile App, UI/UX Design, Digital Marketing, Data Science, Other
  - Difficulty: Beginner, Intermediate, Advanced
  - Price (in ₹)
  - Instructor Name (required)
  - Duration (hours)
  - Course Image (with preview)

- **Edit Course**: Update existing course information
- **Delete Course**: Remove courses from the platform

**How to Add a Course**:

1. Click "Add Course" button in Courses tab
2. Fill in all required fields (title, category, instructor)
3. Optional: Add description, difficulty, duration, image
4. Click "Create Course"

### 4. **Users Tab**

- View all registered users
- User information: Name, Email, Auth Provider, Role
- Role badges: Admin (red) or User (blue)

### 5. **Settings Tab**

- **Contact Information**:
  - WhatsApp Number
  - Contact Email
- **Homepage Counters**:
  - Total Courses
  - Total Students
  - Total Projects
  - Satisfaction Rate (%)
- **Payment QR Code**: Upload UPI/Payment QR for students

---

## 🔄 Complete Student Enrollment Workflow

### Admin Side:

```
1. Student purchases course
   ↓
2. Order appears in "Orders" tab as "Pending"
   ↓
3. Admin reviews:
   - Course name
   - Student email
   - Payment proof screenshot
   - Payment amount
   ↓
4. Admin takes action:
   - Click "Accept Student" → Student approved
   - Click "Decline Student" → Student rejected
   - Add notes for student (optional)
   ↓
5. Status changes to "completed" or "rejected"
```

### Student Side:

```
1. Student clicks "Accept" or "Decline"
   ↓
2. Student status saved
   ↓
3. Can access course (if accepted)
```

---

## 📋 Database Schema

### Orders Collection

```javascript
{
  id: string,                    // Auto-generated
  courseName: string,            // Course name
  userId: string,                // Student's user ID
  userEmail: string,             // Student's email
  userDisplayName: string,       // Student's name
  amount: number,                // Enrollment price
  status: 'pending|completed|rejected',  // Admin status
  adminNotes: string,            // Admin's comments
  screenshotUrl: string,         // Payment proof image
  studentStatus: 'accepted|declined',    // Student's decision
  studentNotes: string,          // Student's response
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Courses Collection

```javascript
{
  id: string,                    // Auto-generated
  title: string,                 // Course title
  description: string,           // Course description
  category: string,              // Course category
  difficulty: string,            // Beginner/Intermediate/Advanced
  price: number,                 // Course price
  instructorName: string,        // Instructor name
  durationHours: number,         // Course duration
  imageUrl: string,              // Course thumbnail
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## 🎯 Quick Reference

| Task                | Path             | Steps                                           |
| ------------------- | ---------------- | ----------------------------------------------- |
| **Add Course**      | Admin → Courses  | Click "+ Add Course" → Fill form → Save         |
| **Edit Course**     | Admin → Courses  | Click edit icon → Update → Save                 |
| **Delete Course**   | Admin → Courses  | Click delete icon → Confirm                     |
| **Accept Student**  | Admin → Orders   | Click order → Click "Accept Student" → Confirm  |
| **Decline Student** | Admin → Orders   | Click order → Click "Decline Student" → Confirm |
| **View Orders**     | Admin → Orders   | Filter by status, search by name/email          |
| **Update Settings** | Admin → Settings | Update info → Save                              |

---

## ✨ Features Implemented

✅ **Course Management**

- Create courses with full details
- Edit existing courses
- Delete courses
- Image upload for course thumbnails
- Real-time course list updates

✅ **Student Enrollment**

- View all student enrollments
- Accept/Approve students
- Decline/Reject students
- Add admin notes/feedback
- Payment proof verification

✅ **Order Management**

- Search and filter orders
- View detailed order information
- Order status tracking
- Real-time updates

✅ **Website Settings**

- Contact information management
- Homepage statistics
- QR code upload for payments

✅ **Real-time Updates**

- All data syncs automatically
- Live order/course/user updates
- No page refresh needed

---

## 🔐 Admin Authentication

**Login Credentials**:

- Email: `anushgiri110@gmail.com`
- Password: `NextGen1234567890`

Location: `/admin/login`

---

## 📱 Student Features

### Student Enrollments Page

Location: `/student/enrollments`

- View all pending course enrollments
- Accept course enrollment
- Decline course enrollment
- View accepted courses
- Track enrollment status

---

## 🚀 Future Enhancements

- [ ] Email notifications when students are accepted/declined
- [ ] Certificate generation and distribution
- [ ] Student progress tracking
- [ ] Course completion tracking
- [ ] Video content management UI
- [ ] Student performance analytics
- [ ] Automated reminders for pending enrollments
- [ ] Bulk course import/export

---

## 🐛 Troubleshooting

### Issue: Courses not appearing

- Solution: Refresh the page or check internet connection
- Check: Verify courses are being created in Firebase Firestore

### Issue: Orders not updating

- Solution: Check if admin is logged in correctly
- Check: Verify user ID in localStorage

### Issue: Image upload fails

- Solution: Check file size (should be < 5MB)
- Check: File format (JPG, PNG, GIF, WebP supported)

---

## 📞 Support

For issues or questions, contact: anushgiri110@gmail.com
