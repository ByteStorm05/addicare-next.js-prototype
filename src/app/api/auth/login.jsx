"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, doc, getDoc, query, where ,updateDoc } from 'firebase/firestore';
import { db } from "../../../firebaseconfig"; 
import { signIn, getSession } from "next-auth/react";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      });
      if (result.error) {
        console.error("Login error:", result.error);
      } else {
        console.log("Login successful");
        // Get the user's UID after successful login
        const session = await getSession();
        if (session && session.user) {
          await updateUserStreak(session.user.id);
          router.push("/");
        } else {
          console.error("User session not found after login");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  const updateUserStreak = async (uid) => {
    const userRef = doc(db, "users", uid);
    let userDoc = await getDoc(userRef);
  
    if (!userDoc.exists()) {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        userDoc = querySnapshot.docs[0];
      }
    }
    try {
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const today = new Date();
        const lastLogin = userData.lastLogin ? new Date(userData.lastLogin) : null;
        
        let newStreak = userData.Streak || 0;
        if (lastLogin && isYesterday(lastLogin)) {
          newStreak++;
        } else if (!lastLogin || !isToday(lastLogin)) {
          newStreak = 1;
        }
        let LibertyPoints = userData.LibertyPoints || 0;
        LibertyPoints += 50; // Add 50 LibertyPoints on every login
        
        // Update user document in Firestore
        await updateDoc(userRef, {
          Streak: newStreak,
          LibertyPoints: LibertyPoints,
          lastLogin: today.toISOString()
        });
        
        console.log("User streak and LibertyPoints updated");
      } else {
        console.error("User document not found");
      }
    } catch (error) {
      console.error("Error updating user streak:", error);
    }
  };
  
  const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  };
  
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-900">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-700">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to continue your journey</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>
          </div>
          <div>
            <button 
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/authentication/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}