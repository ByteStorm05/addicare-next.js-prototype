/*"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { BookOpen, Info, Star } from 'lucide-react';

const lightGreen = '#e8f5e9';
const mediumGreen = '#66bb6a';
const darkGreen = '#2e7d32';

export default function StoryPage() {
  const [storyData, setStoryData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const formData = JSON.parse(localStorage.getItem('formData'));
    if (!formData) {
      router.push('/');
      return;
    }

    const generateContent = async () => {
      try {
        const storyPrompt = `Create a compelling and deep story (300 words) about a fictional character overcoming ${formData.addictions} addiction and ${formData.struggles}.`;
        const infoPrompt = `Provide information about how ${formData.addictions} addiction forms, how it grows, and general solutions to combat it.`;
        const affirmationPrompt = `Create a confidence-boosting affirmation related to overcoming ${formData.addictions} addiction.`;

        const [storyResponse, infoResponse, affirmationResponse] = await Promise.all([
          fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: storyPrompt }),
          }),
          fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: infoPrompt }),
          }),
          fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: affirmationPrompt }),
          })
        ]);

        const [storyData, infoData, affirmationData] = await Promise.all([
          storyResponse.json(),
          infoResponse.json(),
          affirmationResponse.json()
        ]);

        const cleanText = (text) => {
          return text.replace(/[^\w\s.,!?]/g, '').trim();
        };

        setStoryData({
          story: cleanText(storyData.output),
          info: cleanText(infoData.output),
          affirmation: cleanText(affirmationData.output)
        });
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while generating the content.');
      }
    };

    generateContent();
  }, []);

  const handleContinue = () => {
    router.push('/slides');
  };

  if (!storyData) return (
    <Box className="flex justify-center items-center h-screen bg-white">
      <CircularProgress size={64} thickness={4} style={{ color: darkGreen }} />
    </Box>
  );

  return (
    <Box className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <Box className="max-w-5xl mx-auto">
        <Typography variant="h2" component="h1" style={{ color: darkGreen }} className="text-center mb-8 font-bold">
          Your Journey to Overcoming Challenges
        </Typography>
        
        <Card elevation={2} style={{ backgroundColor: lightGreen, marginBottom: '2rem' }}>
          <CardContent className="p-6">
            <Box className="flex items-center mb-4">
              <Star style={{ color: mediumGreen }} className="mr-2" size={24} />
              <Typography variant="h5" component="h2" style={{ color: darkGreen }} className="font-semibold">
                Daily Affirmation
              </Typography>
            </Box>
            <Typography variant="body1" style={{ color: darkGreen }} className="italic">
              "{storyData.affirmation}"
            </Typography>
          </CardContent>
        </Card>

        <Box className="grid md:grid-cols-2 gap-8 mb-8">
          <Card elevation={2} style={{ backgroundColor: lightGreen }}>
            <CardContent className="p-6">
              <Box className="flex items-center mb-4">
                <BookOpen style={{ color: mediumGreen }} className="mr-2" size={24} />
                <Typography variant="h5" component="h2" style={{ color: darkGreen }} className="font-semibold">
                  Your Inspiring Story
                </Typography>
              </Box>
              <Typography variant="body1" style={{ color: darkGreen }} className="leading-relaxed">
                {storyData.story}
              </Typography>
            </CardContent>
          </Card>

          <Card elevation={2} style={{ backgroundColor: lightGreen }}>
            <CardContent className="p-6">
              <Box className="flex items-center mb-4">
                <Info style={{ color: mediumGreen }} className="mr-2" size={24} />
                <Typography variant="h5" component="h2" style={{ color: darkGreen }} className="font-semibold">
                  Understanding Your Challenge
                </Typography>
              </Box>
              <Typography variant="body1" style={{ color: darkGreen }} className="leading-relaxed">
                {storyData.info}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box className="text-center">
          <Button
            variant="contained"
            size="large"
            onClick={handleContinue}
            style={{
              backgroundColor: mediumGreen,
              color: 'white',
              padding: '12px 32px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: '50px',
            }}
          >
            Continue to Your Personal Plan
          </Button>
        </Box>

        <Box className="mt-8 flex justify-center items-center space-x-8">
          {['Pinterest', 'NETFLIX', 'coinbase', 'NASA'].map((brand) => (
            <Typography key={brand} variant="body2" style={{ color: darkGreen, opacity: 0.7 }}>
              {brand}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}*/