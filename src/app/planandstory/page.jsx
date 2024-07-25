"use client"
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { Typography, Card, CardContent, Button, Box, CircularProgress } from '@mui/material';
import { BookOpen, Info, Star } from 'lucide-react';
import Navbar from "../components/Mainnavnar";
import { db } from '../../firebaseconfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const lightGreen = '#e8f5e9';
const mediumGreen = '#66bb6a';
const darkGreen = '#2e7d32';

export default function UnifiedStoryAndPlanPage() {
  const [storyData, setStoryData] = useState(null);
  const [plan, setPlan] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const planId = searchParams.get('planId');
    if (!planId) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        const docRef = doc(db, 'userPlans', planId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setPlan(data.plan);
          const formData = data.formData;

          if (data.story && data.info) {
            // If story and info already exist, use them
            setStoryData({
              story: data.story,
              info: data.info,
              affirmation: await generateAffirmation(formData.addictions)
            });
          } else {
            // If story and info don't exist, generate them
            const generatedContent = await generateContent(formData);
            setStoryData({
              ...generatedContent,
              affirmation: await generateAffirmation(formData.addictions)
            });

            // Update the document with the new story and info
            await updateDoc(docRef, {
              story: generatedContent.story,
              info: generatedContent.info
            });
          }
        } else {
          console.log("No such document!");
          router.push('/');
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        alert('An error occurred while fetching the data.');
      }
    };

    fetchData();
  }, []);

  const generateContent = async (formData) => {
    try {
      const storyPrompt = `Create a compelling and deep story (300 words) about a fictional character overcoming ${formData.addictions} addiction and ${formData.struggles}.`;
      const infoPrompt = `Provide information about how ${formData.addictions} addiction forms, how it grows, and general solutions to combat it.`;

      const [storyResponse, infoResponse] = await Promise.all([
        fetch('/api/gemini', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: storyPrompt }) }),
        fetch('/api/gemini', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: infoPrompt }) })
      ]);

      const [storyData, infoData] = await Promise.all([
        storyResponse.json(),
        infoResponse.json()
      ]);

      const cleanText = (text) => text.replace(/[^\w\s.,!?]/g, '').trim();

      return {
        story: cleanText(storyData.output),
        info: cleanText(infoData.output)
      };
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while generating the content.');
      return { story: '', info: '' };
    }
  };

  const generateAffirmation = async (addictions) => {
    try {
      const affirmationPrompt = `Create a confidence-boosting affirmation related to overcoming ${addictions} addiction.`;
      const affirmationResponse = await fetch('/api/gemini', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: affirmationPrompt }) });
      const affirmationData = await affirmationResponse.json();
      return affirmationData.output.replace(/[^\w\s.,!?]/g, '').trim();
    } catch (error) {
      console.error('Error generating affirmation:', error);
      return "You are strong and capable of overcoming any challenge.";
    }
  };

  const nextSlide = () => {
    if (currentSlide < plan.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  if (!storyData || plan.length === 0) return (
    <Box className="flex justify-center items-center h-screen bg-gray-100">
      <CircularProgress size={64} thickness={4} style={{ color: darkGreen }} />
    </Box>
  );

  const currentStep = plan[currentSlide];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
            <nav aria-label="Sidebar" className="sticky top-4 divide-y divide-gray-300">
              <Card sx={{ mb: 2, backgroundColor: lightGreen }}>
                <CardContent>
                  <Box className="flex items-center mb-4">
                    <Star style={{ color: mediumGreen }} className="mr-2" size={24} />
                    <Typography variant="h6" style={{ color: darkGreen }}>Daily Affirmation</Typography>
                  </Box>
                  <Typography variant="body2" style={{ color: darkGreen }} className="italic">
                    "{storyData.affirmation}"
                  </Typography>
                </CardContent>
              </Card>
            </nav>
          </div>

          {/* Main content area */}
          <main className="lg:col-span-6 xl:col-span-7">
            <Card sx={{ mb: 4, backgroundColor: lightGreen }}>
              <CardContent>
                <Typography variant="h5" style={{ color: darkGreen }} gutterBottom>Your Personalized Plan</Typography>
                <Box className="mb-4 p-4 rounded-lg bg-white">
                  <Box className="flex items-start mb-2">
                    <CheckCircleIcon style={{ color: mediumGreen }} className="h-6 w-6 mr-2 mt-1" />
                    <Typography variant="h6" style={{ color: darkGreen }}>{`Step ${currentSlide + 1}: ${currentStep.title}`}</Typography>
                  </Box>
                  <ul className="list-decimal list-inside pl-8 space-y-2">
                    {currentStep.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="text-sm">{task}</li>
                    ))}
                  </ul>
                </Box>
                <Box className="flex justify-between">
                  <Button
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    variant="contained"
                    style={{ backgroundColor: currentSlide === 0 ? '#ccc' : mediumGreen }}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={nextSlide}
                    disabled={currentSlide === plan.length - 1}
                    variant="contained"
                    style={{ backgroundColor: currentSlide === plan.length - 1 ? '#ccc' : mediumGreen }}
                  >
                    Next
                  </Button>
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ backgroundColor: lightGreen }}>
              <CardContent>
                <Box className="flex items-center mb-4">
                  <Info style={{ color: mediumGreen }} className="mr-2" size={24} />
                  <Typography variant="h6" style={{ color: darkGreen }}>Understanding Your Challenge</Typography>
                </Box>
                <Typography variant="body2" style={{ color: darkGreen }}>
                  {storyData.info}
                </Typography>
              </CardContent>
            </Card>
          </main>

          {/* Right column */}
          <aside className="hidden xl:block xl:col-span-3">
            <div className="sticky top-4 space-y-4">
              <Card sx={{ backgroundColor: lightGreen }}>
                <CardContent>
                  <Box className="flex items-center mb-4">
                    <BookOpen style={{ color: mediumGreen }} className="mr-2" size={24} />
                    <Typography variant="h6" style={{ color: darkGreen }}>Your Inspiring Story</Typography>
                  </Box>
                  <Typography variant="body2" style={{ color: darkGreen }}>
                    {storyData.story}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}