"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../../firebaseconfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ExclamationCircleIcon, UserCircleIcon } from "@heroicons/react/solid";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    bio: "",
    organization: "",
    twitter: "",
    linkedin: "",
    github: "",
    profilePicture: null,
    LibertyPoints : "",
    Streak:""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const db = getFirestore();
  const storage = getStorage();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, profilePicture: file }));
  };

  const uploadImage = async () => {
    if (!formData.profilePicture) return null;
    
    const fileExtension = formData.profilePicture.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `profilePictures/${fileName}`);
    
    await uploadBytes(storageRef, formData.profilePicture);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // First, upload the image if one is selected
      const profilePictureUrl = await uploadImage();

      // Then, create the user account
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Update the user profile
      await updateProfile(user, { 
        displayName: formData.name, 
        photoURL: profilePictureUrl 
      });

      // Finally, save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        location: formData.location,
        bio: formData.bio,
        organization: formData.organization,
        twitter: formData.twitter,
        linkedin: formData.linkedin,
        github: formData.github,
        profilePictureUrl,
        createdAt: new Date(),
        uid: user.uid,
        LibertyPoints: formData.LibertyPoints,
        Streak: formData.Streak,
      });

      router.push("/");
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-900 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Your Account</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                id="name"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <input
                id="location"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                name="location"
                placeholder="New York, USA"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              id="bio"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              name="bio"
              placeholder="Tell us about yourself"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700">Organization</label>
              <input
                id="organization"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                name="organization"
                placeholder="Company Inc."
                value={formData.organization}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">Twitter</label>
              <input
                id="twitter"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                name="twitter"
                placeholder="@username"
                value={formData.twitter}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">LinkedIn</label>
              <input
                id="linkedin"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                name="linkedin"
                placeholder="linkedin.com/in/username"
                value={formData.linkedin}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="github" className="block text-sm font-medium text-gray-700">GitHub</label>
              <input
                id="github"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                name="github"
                placeholder="github.com/username"
                value={formData.github}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <div className="mt-1 flex items-center space-x-5">
              <div className="flex-shrink-0">
                {formData.profilePicture ? (
                  <img
                    src={URL.createObjectURL(formData.profilePicture)}
                    alt="Profile preview"
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="h-16 w-16 text-gray-300" />
                )}
              </div>
              <label htmlFor="profile-picture" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Change
              </label>
              <input
                id="profile-picture"
                name="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
              <ExclamationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;