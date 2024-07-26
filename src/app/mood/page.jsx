"use client"
import React, { useState, useEffect } from 'react';
import { EmojiHappyIcon, EmojiSadIcon, FireIcon, ThumbUpIcon, HeartIcon, ThumbDownIcon } from '@heroicons/react/solid';
import { getSession } from "next-auth/react";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from "../../firebaseconfig"; 
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Navbar from "../components/Mainnavnar";
import { Card, CardContent, Typography, Button, Slider } from '@mui/material';

const moodEmojis = [
  { emoji: '😊', name: 'Happy', icon: EmojiHappyIcon, color: 'bg-yellow-400' },
  { emoji: '😢', name: 'Sad', icon: EmojiSadIcon, color: 'bg-blue-400' },
  { emoji: '😡', name: 'Angry', icon: FireIcon, color: 'bg-red-400' },
  { emoji: '😌', name: 'Relaxed', icon: ThumbUpIcon, color: 'bg-green-400' },
  { emoji: '😟', name: 'Uncomfortable', icon: ThumbDownIcon, color: 'bg-pink-400' },
  { emoji: '🫡', name: 'Submissive', icon: HeartIcon, color: 'bg-pink-400' },
];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodIntensity, setMoodIntensity] = useState(5);
  const [suggestion, setSuggestion] = useState('');
  const [affirmation, setAffirmation] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [streak, setStreak] = useState(0);
  const [libertyScore, setLibertyScore] = useState(0);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("Session status:", status);
    console.log("Session data:", session);
    if (status === "authenticated") {
      console.log("gimme");
    } else if (status === "unauthenticated") {
      router.push("/authentication/login");
    }
  }, [status, router]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('moodHistory');
    if (storedHistory) {
      setMoodHistory(JSON.parse(storedHistory));
    }
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const session = await getSession();
      if (session && session.user) {
        const userRef = doc(db, "users", session.user.id);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setStreak(userData.Streak || 0);
          setLibertyScore(userData.LibertyPoints || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const handleIntensityChange = (e) => {
    setMoodIntensity(parseInt(e.target.value));
  };

  const updateUserStreak = async (uid) => {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const today = new Date();
      const lastMoodLog = userData.lastMoodLog ? new Date(userData.lastMoodLog) : null;
      
      let newStreak = userData.Streak || 0;
      if (lastMoodLog && isYesterday(lastMoodLog)) {
        newStreak++;
      } else if (!lastMoodLog || !isToday(lastMoodLog)) {
        newStreak = 1;
      }
      let newLibertyPoints = userData.LibertyPoints || 0;
      newLibertyPoints += 10; // Add 10 LibertyPoints on every mood log
      
      // Update user document in Firestore
      await updateDoc(userRef, {
        Streak: newStreak,
        LibertyPoints: newLibertyPoints,
        lastMoodLog: today.toISOString()
      });
      
      setStreak(newStreak);
      setLibertyScore(newLibertyPoints);
      
      console.log("User streak and LibertyPoints updated");
    } else {
      console.error("User document not found");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMood) return;

    const newMoodEntry = { mood: selectedMood, intensity: moodIntensity, timestamp: new Date().toISOString() };
    const updatedHistory = [...moodHistory, newMoodEntry];
    setMoodHistory(updatedHistory);
    localStorage.setItem('moodHistory', JSON.stringify(updatedHistory));

    try {
      const session = await getSession();
      if (session && session.user) {
        await updateUserStreak(session.user.id);
      } else {
        console.log("session error");
      }
      
      const moodTrend = getMoodTrend(updatedHistory);
      
      const suggestionPrompt = `Based on a person feeling ${selectedMood.name.toLowerCase()} with an intensity of ${moodIntensity} out of 10, provide a short suggestion to improve or maintain their mood. Consider the trend in their mood over time: ${moodTrend}`;
      
      const affirmationPrompt = `Create a brief, powerful affirmation to boost the emotional well-being of someone feeling ${selectedMood.name.toLowerCase()} with an intensity of ${moodIntensity} out of 10. Consider their recent mood trend: ${moodTrend}`;
      
      const insightPrompt = `Provide a brief insight or reflection about the emotional state of someone feeling ${selectedMood.name.toLowerCase()} with an intensity of ${moodIntensity} out of 10, considering their recent mood trend: ${moodTrend}`;

      const [suggestionResponse, affirmationResponse, insightResponse] = await Promise.all([
        fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: suggestionPrompt }),
        }),
        fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: affirmationPrompt }),
        }),
        fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: insightPrompt }),
        })
      ]);

      if (!suggestionResponse.ok || !affirmationResponse.ok || !insightResponse.ok) 
        throw new Error('API request failed');

      const [suggestionData, affirmationData, insightData] = await Promise.all([
        suggestionResponse.json(),
        affirmationResponse.json(),
        insightResponse.json()
      ]);

      setSuggestion(suggestionData.output.trim());
      setAffirmation(affirmationData.output.trim());
      // You can use the insight data if needed
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while generating suggestions.');
    }
  };

  const getMoodTrend = (history) => {
    if (history.length < 2) return "Not enough data to determine a trend.";
    const recentMoods = history.slice(-5);
    const moodNames = recentMoods.map(entry => entry.mood.name);
    const intensities = recentMoods.map(entry => entry.intensity);
    return `Recent moods: ${moodNames.join(', ')}. Intensities: ${intensities.join(', ')}.`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
            <nav aria-label="Sidebar" className="sticky top-4 divide-y divide-gray-300">
              <Card className="mb-2 rounded-lg shadow-md border border-gray-200">
                <CardContent className="flex items-center justify-center p-4">
                  <Typography variant="h6" className="font-semibold">Mood Tracker</Typography>
                </CardContent>
              </Card>
              {/* Repeat similar card for other sections or moods */}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 xl:col-span-10">
            <section aria-labelledby="mood-tracker-heading">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h2 id="mood-tracker-heading" className="text-lg font-medium text-gray-900">Track Your Mood</h2>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Select Mood</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                          {moodEmojis.map((mood) => (
                            <Card
                              key={mood.name}
                              className={`cursor-pointer ${selectedMood?.name === mood.name ? 'bg-blue-100' : 'bg-white'} rounded-lg shadow-md border border-gray-200`}
                              onClick={() => handleMoodSelect(mood)}
                            >
                              <CardContent className="flex flex-col items-center justify-center p-4">
                                <div className={`w-16 h-16 ${mood.color} rounded-full flex items-center justify-center`}>
                                  <mood.icon className="h-12 w-12 text-white" />
                                </div>
                                <Typography className="mt-2 text-center text-lg font-semibold">{mood.emoji}</Typography>
                                <Typography className="mt-1 text-center text-sm text-gray-600">{mood.name}</Typography>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </dd>
                    </div>

                    {selectedMood && (
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Mood Intensity</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          <Slider
                            value={moodIntensity}
                            min={1}
                            max={10}
                            onChange={handleIntensityChange}
                            aria-labelledby="mood-intensity-slider"
                          />
                          <Typography className="text-sm text-gray-700">Intensity: {moodIntensity}</Typography>
                        </dd>
                      </div>
                    )}

                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Suggestions</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <Typography>{suggestion || "No suggestions yet"}</Typography>
                      </dd>
                    </div>
                    
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Affirmation</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <Typography>{affirmation || "No affirmation yet"}</Typography>
                      </dd>
                    </div>

                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Your Mood History</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <div>
                          {moodHistory.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between border-b py-2">
                              <div className="flex items-center">
                                <Typography className="text-sm font-medium">{entry.mood.emoji} {entry.mood.name} - {entry.intensity}/10</Typography>
                              </div>
                              <Typography className="text-sm text-gray-500">{new Date(entry.timestamp).toLocaleDateString()}</Typography>
                            </div>
                          ))}
                        </div>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </section>

            <form onSubmit={handleSubmit} className="mt-6">
              <Button type="submit" variant="contained" color="primary" className="w-full">
                Submit Mood
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
