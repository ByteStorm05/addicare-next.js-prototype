/*"use client"
import React, { useState, useEffect } from 'react';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/navigation';

export default function PlanSlides() {
  const [plan, setPlan] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const storedPlan = localStorage.getItem('plan');
    if (storedPlan) {
      setPlan(JSON.parse(storedPlan));
    } else {
      router.push('/');
    }
  }, []);

  if (plan.length === 0) {
    return null;
  }

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

  const currentStep = plan[currentSlide];

  return (
    <div className="flex max-w-6xl mx-auto mt-10">
      <aside className="w-64 bg-purple-100 p-4 rounded-lg shadow-md mr-6">
        <h2 className="text-xl font-semibold mb-4">View Community</h2>
        <nav>
          <ul className="space-y-3">
            <li>
              <button className="w-full text-left py-2 px-3 bg-white rounded-md shadow-sm hover:bg-purple-50 transition-colors">
                <span className="font-medium">Post</span>
              </button>
            </li>
            <li>
              <button className="w-full text-left py-2 px-3 bg-white rounded-md shadow-sm hover:bg-purple-50 transition-colors">
                Explore
              </button>
            </li>
            <li>
              <button className="w-full text-left py-2 px-3 bg-white rounded-md shadow-sm hover:bg-purple-50 transition-colors">
                Find similar people
              </button>
            </li>
            <li>
              <button className="w-full text-left py-2 px-3 bg-white rounded-md shadow-sm hover:bg-purple-50 transition-colors">
                Liberty Points
              </button>
            </li>
          </ul>
        </nav>
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Leaderboard</h3>
         
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Label</h3>
  
        </div>
      </aside>
      
      <div className="flex-1">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Your Personalized Plan</h1>
          <div className="mb-4">
            <div className="p-4 rounded-lg bg-blue-50">
              <div className="flex items-start mb-2">
                <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 mt-1" />
                <h3 className="font-semibold text-lg">{`Step ${currentSlide + 1}: ${currentStep.title}`}</h3>
              </div>
              <ul className="list-decimal list-inside pl-8 space-y-2">
                {currentStep.tasks.map((task, taskIndex) => (
                  <li key={taskIndex} className="text-sm">{task}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex justify-between">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={nextSlide}
              disabled={currentSlide === plan.length - 1}
              className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}*/