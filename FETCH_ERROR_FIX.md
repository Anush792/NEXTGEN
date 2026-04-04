# Fetch Error Troubleshooting Guide

## "TypeError: fetch failed" - Complete Solution

### What Was Fixed

The course creation error was caused by **NaN (Not a Number) conversion**:

- Empty price field → `parseFloat('')` → `NaN`
- `JSON.stringify()` converts `NaN` to `null`
- Server rejects `null` as invalid

### ✅ Solutions Implemented

1. **Client-side Validation**
   - Checks each field BEFORE sending request
   - Validates string fields are not empty
   - Validates numbers are valid (using `isNaN()`)
   - Shows specific error for each field

2. **Better Error Handling**
   - Catches network errors separately
   - Shows helpful message if server is not running
   - Displays actual server error messages
   - Better error logging in console

3. **Data Sanitization**
   - Trim whitespace from all text fields
   - Validate numeric values before conversion
   - Ensure positive numbers only

---

## If You Still Get "fetch failed"

### Step 1: Verify Server is Running

```bash
# Check if development server is running
npm run dev
```

**Server should say:**

```
Local: http://localhost:3000
```

or

```
Port 3000 is in use, trying 3001 instead
```

### Step 2: Check Browser Console

Press **F12** → **Console** tab

**Look for errors like:**

```
Network error: Could not reach server
```

**Or specific field errors:**

```
Please enter a valid price
Course image URL is required
```

### Step 3: Verify API Endpoint

Open browser and test this URL:

```
http://localhost:3000/api/courses
```

Should show: `405 Method Not Allowed` (GET not allowed) - this is CORRECT

### Step 4: Check Network Tab

Press **F12** → **Network** tab → Click "Create Course"

**Look at the request:**

- ✅ Method: `POST`
- ✅ URL: `/api/courses`
- ✅ Status: Should be `201` (success) or `400` (validation error)

**Check Response tab:**

```json
{
  "id": "uuid",
  "title": "Course Name",
  ...
}
```

---

## Common Issues & Solutions

### Issue 1: "Network error: Could not reach server"

**Cause:** Development server not running

**Solution:**

```bash
npm run dev
```

Wait for output showing port 3000 or 3001

### Issue 2: "Please enter a valid price"

**Cause:** Price field is empty or not a number

**Solution:**

1. Go back to form
2. Click "Add Course" again
3. Enter numeric price like `2999`
4. Leave NO fields empty that are marked with \*

### Issue 3: "Course title is required"

**Cause:** One of the required fields (\*) is empty

**Solution:**
Check all fields marked with asterisk (\*):

- ✅ Course Title \*
- ✅ Description \*
- ✅ Price \*
- ✅ Instructor Name \*
- ✅ Course Image URL \*

Fill all of them completely.

### Issue 4: Form Won't Submit

**Cause:** Validation prevents sending invalid data

**Solution:**
Check browser console (F12) for specific error message:

- "Title is required"
- "Invalid price format"
- "Image URL is required"

Fix the error and try again.

### Issue 5: Blank Error Message

**Cause:** Unexpected server error

**Solution:**

1. Check server logs (where you ran `npm run dev`)
2. Look for error messages
3. Try creating a simpler course first
4. Check image URL is accessible

---

## Complete Course Creation Checklist

Before clicking "Create Course", verify:

- [ ] **Course Title** - Not empty, meaningful name
- [ ] **Description** - At least 20 characters
- [ ] **Category** - Dropdown selected
- [ ] **Difficulty** - Dropdown selected
- [ ] **Instructor Name** - Your name or team name
- [ ] **Duration** - Number like 10, 20, 50
- [ ] **Price** - Number like 1999, 2999, 3999
- [ ] **Course Image URL** - Valid image URL starting with https://
- [ ] **Intro Video URL** (optional) - Valid YouTube URL or leave blank

### Price Format Examples

```
❌ "₹2999" → WRONG (currency symbol)
❌ "2,999" → WRONG (comma)
❌ "" → WRONG (empty)
✅ "2999" → CORRECT
✅ "4999" → CORRECT
```

### Image URL Format

```
❌ "unsplash.com" → WRONG (not full URL)
❌ "https://example.com" → WRONG (no image)
✅ "https://images.unsplash.com/photo-123" → CORRECT
✅ "https://imgur.com/abc123.jpg" → CORRECT
```

---

## Testing the Fix

### Test Case 1: Valid Course Creation

1. Go to Admin Dashboard → Courses Tab
2. Click "Add Course"
3. Fill ALL required fields:
   - Title: "React Fundamentals"
   - Description: "Learn React basics including JSX, components, hooks, and state management"
   - Category: Web Development
   - Difficulty: Beginner
   - Instructor: John Doe
   - Duration: 15
   - Price: 2999
   - Image: https://images.unsplash.com/photo-1633356122544-f134324ef6db
4. Click "Create Course"
5. ✅ Should see: "Course created successfully" (green toast)
6. ✅ Course should appear in the list with image

### Test Case 2: Empty Price Field

1. Follow steps 1-3 above BUT leave Price empty
2. Click "Create Course"
3. ✅ Should see: "Please enter a valid price" (red toast)

### Test Case 3: Empty Title

1. Follow steps 1-3 BUT leave Title empty
2. Click "Create Course"
3. ✅ Should see: "Course title is required" (red toast)

### Test Case 4: Invalid Image URL

1. Follow steps 1-3 BUT use invalid URL like "not-an-image"
2. Click "Create Course"
3. ✅ Course should be created
4. ✅ Image will show as broken or not load (this is a browser issue, not app error)

---

## Enhanced Error Messages

After this fix, you'll see specific error messages:

| Error Message                           | What It Means                     | How to Fix               |
| --------------------------------------- | --------------------------------- | ------------------------ |
| "Course title is required"              | Title field is empty              | Enter a course name      |
| "Course description is required"        | Description is empty              | Write course description |
| "Please enter a valid price"            | Price is empty or not a number    | Enter number like 2999   |
| "Please enter valid duration"           | Duration is empty or not a number | Enter number like 10     |
| "Instructor name is required"           | Instructor field is empty         | Enter instructor name    |
| "Course image URL is required"          | Image URL is empty                | Paste image URL          |
| "Price must be greater than 0"          | Price is 0 or negative            | Enter positive number    |
| "Duration must be greater than 0"       | Duration is 0 or negative         | Enter positive number    |
| "Network error: Could not reach server" | Server not running                | Run `npm run dev`        |
| "Missing required fields: ..."          | Server validation error           | Check all fields again   |

---

## Browser Developer Tools Tips

### To Inspect API Request:

1. Open **F12** → **Network** tab
2. Click "Create Course" button
3. Find the request named `courses` (POST)
4. Click it to see:
   - **Headers**: Shows Content-Type, etc.
   - **Request**: Shows what data was sent
   - **Response**: Shows server's reply
   - **Timing**: Shows how long it took

### To Check JavaScript Errors:

1. Open **F12** → **Console** tab
2. Look for red error messages
3. Click to expand and see full error
4. Copy error text for troubleshooting

### To Clear Cache:

If form seems stuck or old data appears:

1. Press **F12**
2. Right-click the refresh button
3. Select "Empty cache and hard refresh"

---

## Prevention Tips

### To Avoid "Fetch Failed"

- ✅ Always fill required fields (marked with \*)
- ✅ Use valid URLs for images
- ✅ Use numeric values for price and duration
- ✅ Keep server running while using app
- ✅ Use strong internet connection
- ✅ Don't block localhost in firewall

### Best Practices

- ✅ Test image URL in browser first
- ✅ Trim whitespace from text fields
- ✅ Use reasonable prices (100-10000 range)
- ✅ Use realistic durations (1-100 hours)
- ✅ Write descriptive course titles
- ✅ Include keywords in description

---

## More Help

If you still have issues:

1. **Check the logs:**
   - Server logs in terminal (where you ran `npm run dev`)
   - Browser console (F12 → Console tab)

2. **Verify database connection:**
   - Check Supabase is accessible
   - Verify environment variables are set

3. **Clear everything and restart:**

   ```bash
   # Stop server (Ctrl+C)
   # Clear cache
   rm -r .next
   # Restart
   npm run dev
   ```

4. **Check file permissions:**
   - Ensure you can write to `/app/api/courses/route.ts`
   - Ensure database has create permissions

---

**Status:** ✅ Fixed and Tested  
**Date:** April 1, 2026  
**Build:** Successful
