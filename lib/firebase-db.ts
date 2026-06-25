"use client";

import {
  db,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  or,
  type DocumentData
} from "./firebase";

// Types
export interface Order {
  id?: string;
  orderId: string;
  courseId?: string;
  courseName: string;
  userId: string;
  userEmail: string;
  userPassword: string;
  userDisplayName?: string;
  screenshotUrl?: string;
  paymentProofUrl?: string;
  status: "pending" | "completed" | "rejected";
  amount: number;
  adminNotes?: string;
  createdAt: any;
  updatedAt: any;
  certificateUrl?: string;
  graduated?: boolean;
}

export interface AdminSettings {
  whatsappNumber: string;
  contactEmail: string;
  homepageCounters: {
    courses: number;
    students: number;
    projects: number;
    satisfaction: number;
  };
  servicesStats: {
    webDevelopment: number;
    appDevelopment: number;
    digitalMarketing: number;
    seoServices: number;
  };
  heroSettings?: {
    title: string;
    subtitle: string;
    backgroundImageUrl: string;
  };
  qrCodeUrl?: string;
  updatedAt: any;
}

export interface Course {
  id?: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  price: number;
  instructorName: string;
  durationHours: number;
  imageUrl: string;
  videoUrl?: string;
  createdAt: any;
  updatedAt: any;
}

export interface Video {
  id?: string;
  courseName: string;
  title: string;
  youtubeUrl: string;
  orderIndex: number;
  createdAt: any;
}

// Collection references
const ordersCollection = collection(db, "orders");
const usersCollection = collection(db, "users");
const adminSettingsDoc = doc(db, "settings", "admin");
const coursesCollection = collection(db, "courses");
const videosCollection = collection(db, "videos");

// ========== ORDERS ==========

// Create new order
export const createOrder = async (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  try {
    const orderRef = doc(ordersCollection);
    const newOrder: Order = {
      ...orderData,
      id: orderRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(orderRef, newOrder);
    return orderRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order");
  }
};

// Get all orders
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const q = query(ordersCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

// Get orders by user ID
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const q = query(
      ordersCollection,
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    
    // Sort in memory to avoid requiring a composite index
    orders.sort((a, b) => {
      const getVal = (val: any) => {
        if (!val) return 0;
        if (typeof val.toDate === 'function') return val.toDate().getTime();
        if (val.seconds !== undefined) return val.seconds * 1000 + (val.nanoseconds ? val.nanoseconds / 1000000 : 0);
        if (val instanceof Date) return val.getTime();
        const parsed = new Date(val).getTime();
        return isNaN(parsed) ? 0 : parsed;
      };
      return getVal(b.createdAt) - getVal(a.createdAt);
    });
    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
};

// Update order status
export const updateOrderStatus = async (
  orderId: string,
  status: "pending" | "completed" | "rejected",
  adminNotes?: string
): Promise<void> => {
  try {
    const orderRef = doc(db, "orders", orderId);
    const updateData: any = {
      status,
      updatedAt: serverTimestamp()
    };
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }
    await updateDoc(orderRef, updateData);
  } catch (error) {
    console.error("Error updating order:", error);
    throw new Error("Failed to update order");
  }
};

// Approve order
export const approveOrder = async (orderId: string, adminNotes?: string): Promise<void> => {
  await updateOrderStatus(orderId, "completed", adminNotes);
};

// Reject order
export const rejectOrder = async (orderId: string, adminNotes?: string): Promise<void> => {
  await updateOrderStatus(orderId, "rejected", adminNotes);
};

// Delete order
export const deleteOrder = async (orderId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "orders", orderId));
  } catch (error) {
    console.error("Error deleting order:", error);
    throw new Error("Failed to delete order");
  }
};

// Real-time orders listener
export const onOrdersSnapshot = (callback: (orders: Order[]) => void) => {
  const q = query(ordersCollection, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    callback(orders);
  });
};

// Real-time user orders listener
export const onUserOrdersSnapshot = (
  userId: string,
  userEmail: string | null,
  callback: (orders: Order[]) => void
) => {
  const constraints = [where("userId", "==", userId)];
  if (userEmail) {
    constraints.push(where("userEmail", "==", userEmail));
    constraints.push(where("userId", "==", userEmail));
  }

  const q = query(
    ordersCollection,
    or(...constraints)
  );
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    
    // Sort in memory to avoid requiring a composite index
    orders.sort((a, b) => {
      const getVal = (val: any) => {
        if (!val) return 0;
        if (typeof val.toDate === 'function') return val.toDate().getTime();
        if (val.seconds !== undefined) return val.seconds * 1000 + (val.nanoseconds ? val.nanoseconds / 1000000 : 0);
        if (val instanceof Date) return val.getTime();
        const parsed = new Date(val).getTime();
        return isNaN(parsed) ? 0 : parsed;
      };
      return getVal(b.createdAt) - getVal(a.createdAt);
    });
    
    callback(orders);
  }, (error) => {
    console.error("Error in onUserOrdersSnapshot snapshot listener:", error);
    // Call callback with empty array to prevent infinite loading state
    callback([]);
  });
};

// ========== ADMIN SETTINGS ==========

// Get admin settings
export const getAdminSettings = async (): Promise<AdminSettings | null> => {
  try {
    const docSnap = await getDoc(adminSettingsDoc);
    if (docSnap.exists()) {
      return docSnap.data() as AdminSettings;
    }
    return null;
  } catch (error) {
    console.error("Error fetching admin settings:", error);
    return null;
  }
};

// Update admin settings
export const updateAdminSettings = async (settings: Partial<AdminSettings>): Promise<void> => {
  try {
    await setDoc(adminSettingsDoc, {
      ...settings,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error("Error updating admin settings:", error);
    throw new Error("Failed to update settings");
  }
};

// Initialize default admin settings
export const initializeAdminSettings = async (): Promise<void> => {
  try {
    const docSnap = await getDoc(adminSettingsDoc);
    if (!docSnap.exists()) {
      const defaultSettings: AdminSettings = {
        whatsappNumber: "9821539140",
        contactEmail: "contact@nextgencoders.com",
        homepageCounters: {
          courses: 6,
          students: 500,
          projects: 100,
          satisfaction: 98
        },
        servicesStats: {
          webDevelopment: 45,
          appDevelopment: 30,
          digitalMarketing: 15,
          seoServices: 10
        },
        updatedAt: serverTimestamp()
      };
      await setDoc(adminSettingsDoc, defaultSettings);
    }
  } catch (error) {
    console.error("Error initializing admin settings:", error);
  }
};

// Real-time admin settings listener
export const onAdminSettingsSnapshot = (callback: (settings: AdminSettings) => void) => {
  return onSnapshot(adminSettingsDoc, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as AdminSettings);
    }
  });
};

// ========== COURSES ==========

// Create course
export const createCourse = async (courseData: Omit<Course, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  try {
    const courseRef = doc(coursesCollection);
    const newCourse: Course = {
      ...courseData,
      id: courseRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(courseRef, newCourse);
    return courseRef.id;
  } catch (error) {
    console.error("Error creating course:", error);
    throw new Error("Failed to create course");
  }
};

// Get all courses
export const getAllCourses = async (): Promise<Course[]> => {
  try {
    const q = query(coursesCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

// Update course
export const updateCourse = async (courseId: string, courseData: Partial<Course>): Promise<void> => {
  try {
    const courseRef = doc(db, "courses", courseId);
    await updateDoc(courseRef, {
      ...courseData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating course:", error);
    throw new Error("Failed to update course");
  }
};

// Delete course
export const deleteCourse = async (courseId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "courses", courseId));
  } catch (error) {
    console.error("Error deleting course:", error);
    throw new Error("Failed to delete course");
  }
};

// Real-time courses listener
export const onCoursesSnapshot = (callback: (courses: Course[]) => void) => {
  const q = query(coursesCollection, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const courses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
    callback(courses);
  });
};

// ========== VIDEOS ==========

// Create video
export const createVideo = async (videoData: Omit<Video, "id" | "createdAt">): Promise<string> => {
  try {
    const videoRef = doc(videosCollection);
    const newVideo: Video = {
      ...videoData,
      id: videoRef.id,
      createdAt: serverTimestamp()
    };
    await setDoc(videoRef, newVideo);
    return videoRef.id;
  } catch (error) {
    console.error("Error creating video:", error);
    throw new Error("Failed to create video");
  }
};

// Get videos by course
export const getCourseVideos = async (courseName: string): Promise<Video[]> => {
  try {
    const q = query(
      videosCollection,
      where("courseName", "==", courseName)
    );
    const snapshot = await getDocs(q);
    const videos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
    
    // Sort in memory to avoid requiring a composite index
    videos.sort((a, b) => {
      const indexA = a.orderIndex !== undefined ? Number(a.orderIndex) : 0;
      const indexB = b.orderIndex !== undefined ? Number(b.orderIndex) : 0;
      return indexA - indexB;
    });
    return videos;
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
};

// Delete video
export const deleteVideo = async (videoId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "videos", videoId));
  } catch (error) {
    console.error("Error deleting video:", error);
    throw new Error("Failed to delete video");
  }
};

// Real-time videos listener for a course
export const onCourseVideosSnapshot = (courseName: string, callback: (videos: Video[]) => void) => {
  const q = query(
    videosCollection,
    where("courseName", "==", courseName)
  );
  return onSnapshot(q, (snapshot) => {
    const videos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
    
    // Sort in memory to avoid requiring a composite index
    videos.sort((a, b) => {
      const indexA = a.orderIndex !== undefined ? Number(a.orderIndex) : 0;
      const indexB = b.orderIndex !== undefined ? Number(b.orderIndex) : 0;
      return indexA - indexB;
    });
    
    callback(videos);
  }, (error) => {
    console.error("Error in onCourseVideosSnapshot listener:", error);
    callback([]);
  });
};

// ========== USERS ==========

// Get all users
export const getAllUsers = async (): Promise<DocumentData[]> => {
  try {
    const q = query(usersCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// Real-time users listener
export const onUsersSnapshot = (callback: (users: DocumentData[]) => void) => {
  const q = query(usersCollection, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(users);
  });
};

// ========== EXTENDED VIDEO FUNCTIONS ==========

// Get all videos (admin view)
export const getAllVideos = async (): Promise<Video[]> => {
  try {
    const q = query(videosCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
  } catch (error) {
    console.error("Error fetching all videos:", error);
    return [];
  }
};

// Update video
export const updateVideo = async (videoId: string, videoData: Partial<Video>): Promise<void> => {
  try {
    const videoRef = doc(db, "videos", videoId);
    await updateDoc(videoRef, videoData);
  } catch (error) {
    console.error("Error updating video:", error);
    throw new Error("Failed to update video");
  }
};

// Real-time all videos listener (admin)
export const onAllVideosSnapshot = (callback: (videos: Video[]) => void) => {
  const q = query(videosCollection, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const videos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
    callback(videos);
  });
};
