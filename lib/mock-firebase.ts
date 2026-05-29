// Mock Firebase Auth for Demo Purposes
// This simulates OAuth without requiring real Firebase credentials

interface MockUser {
  email: string;
  uid: string;
  provider: string;
}

class MockAuth {
  private currentUser: MockUser | null = null;
  private listeners: ((user: MockUser | null) => void)[] = [];

  // Mock user database
  private users = [
    { email: 'demo@gmail.com', uid: 'demo-user-1', provider: 'google' },
    { email: 'test@facebook.com', uid: 'demo-user-2', provider: 'facebook' }
  ];

  // Add missing Firebase Auth properties
  app: any = { name: 'Mock Firebase App' };
  name = 'MockAuth';
  config = {};
  setPersistence = () => Promise.resolve();
  useDeviceLanguage = () => {};
  languageCode = 'en';
  tenantId = null;
  settings = {};

  onAuthStateChanged(callback: (user: MockUser | null) => void) {
    this.listeners.push(callback);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  async signInWithPopup(provider: any) {
    // Simulate OAuth popup delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock successful login based on provider
    const mockUser = provider.name === 'google'
      ? this.users[0]
      : this.users[1];

    this.currentUser = mockUser;
    this.listeners.forEach(listener => listener(mockUser));

    return { user: mockUser };
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (email && password.length >= 6) {
      const mockUser = {
        email,
        uid: `email-user-${Date.now()}`,
        provider: 'email'
      };
      this.currentUser = mockUser;
      this.listeners.forEach(listener => listener(mockUser));
      return { user: mockUser };
    }
    throw new Error('Invalid email or password');
  }

  async createUserWithEmailAndPassword(email: string, password: string) {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (email && password.length >= 6) {
      const mockUser = {
        email,
        uid: `new-user-${Date.now()}`,
        provider: 'email'
      };
      this.currentUser = mockUser;
      this.listeners.forEach(listener => listener(mockUser));
      return { user: mockUser };
    }
    throw new Error('Failed to create account');
  }

  signOut() {
    this.currentUser = null;
    this.listeners.forEach(listener => listener(null));
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

// Mock Providers
class MockGoogleProvider {
  name = 'google';
  setCustomParameters() {}
}

class MockFacebookProvider {
  name = 'facebook';
  setCustomParameters() {}
}

// Mock Firebase functions that work with our mock auth
export const signInWithPopup = (auth: MockAuth, provider: any) => auth.signInWithPopup(provider);
export const signInWithEmailAndPassword = (auth: MockAuth, email: string, password: string) => auth.signInWithEmailAndPassword(email, password);
export const createUserWithEmailAndPassword = (auth: MockAuth, email: string, password: string) => auth.createUserWithEmailAndPassword(email, password);
export const onAuthStateChanged = (auth: MockAuth, callback: (user: any) => void) => auth.onAuthStateChanged(callback);

// Mock User type
export type User = MockUser;

// Export mock instances
export const auth = new MockAuth() as any; // Type assertion to match Firebase Auth
export const googleProvider = new MockGoogleProvider() as any;
export const facebookProvider = new MockFacebookProvider() as any;

// Mock Firebase app
export default {
  name: 'Mock Firebase App'
};