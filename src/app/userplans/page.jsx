"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { db } from '../../firebaseconfig'; // Adjust the import path as needed
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Typography, Card, CardContent, Button, Box, CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import { PlusCircle, FileText } from 'lucide-react';
import Navbar from "../components/Mainnavnar";
import  Prompt  from '../prompt/page';

const lightGreen = '#e8f5e9';
const mediumGreen = '#66bb6a';
const darkGreen = '#2e7d32';

export default function UserPlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/authentication/login");
    } else if (status === "authenticated") {
      fetchUserPlans();
    }
  }, [status, router]);

  const fetchUserPlans = async () => {
    try {
      const q = query(collection(db, 'userPlans'), where('userId', '==', session.user.id));
      const querySnapshot = await getDocs(q);
      const userPlans = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPlans(userPlans);
    } catch (error) {
      console.error("Error fetching user plans:", error);
      alert('An error occurred while fetching your plans.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = () => {
    setShowPrompt(true);
  };

  const handlePlanClick = (planId) => {
    router.push(`/planandstory?planId=${planId}`);
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen bg-gray-100">
        <CircularProgress size={64} thickness={4} style={{ color: darkGreen }} />
      </Box>
    );
  }

  if (showPrompt) {
    return <Prompt />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <Card sx={{ backgroundColor: lightGreen, mb: 4 }}>
          <CardContent>
            <Typography variant="h4" style={{ color: darkGreen }} gutterBottom>
              Your Plans
            </Typography>
            {plans.length === 0 ? (
              <Typography variant="body1" style={{ color: darkGreen }}>
                You haven't created any plans yet. Click the button below to create your first plan!
              </Typography>
            ) : (
              <List>
                {plans.map((plan) => (
                  <ListItem
                    key={plan.id}
                    button
                    onClick={() => handlePlanClick(plan.id)}
                    sx={{
                      mb: 2,
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      '&:hover': { backgroundColor: '#f0f0f0' }
                    }}
                  >
                    <FileText style={{ color: mediumGreen, marginRight: '16px' }} />
                    <ListItemText
                      primary={`Plan created on ${new Date(plan.createdAt.toDate()).toLocaleDateString()}`}
                      secondary={`Challenges: ${plan.formData.addictions}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
        <Button
          variant="contained"
          startIcon={<PlusCircle />}
          onClick={handleCreatePlan}
          fullWidth
          sx={{
            backgroundColor: mediumGreen,
            '&:hover': { backgroundColor: darkGreen },
            py: 2
          }}
        >
          Create New Plan
        </Button>
      </main>
    </div>
  );
}