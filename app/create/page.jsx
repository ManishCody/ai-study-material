"use client";
import React, { useState, useEffect } from "react";
import SelectOption from "./_component/SelectOption";
import { Button } from "@/components/ui/button";
import TopicInput from "./_component/TopicInput";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

const Create = () => {
  const [steps, setSteps] = useState(0);
  const [formData, setFormData] = useState({
    purpose: "",
    topic: "",
    difficulty: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  // Check user authentication & credits
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace("/sign-in");
      return;
    }

    const checkUserCredits = async () => {
      try {
        const userEmail = user?.primaryEmailAddress?.emailAddress;        

        const res = await axios.get(`/api/check-credits`, {
          params: { email: userEmail },
        });
        
        if (!res.data.hasCredits) {
          router.replace("/dashboard");
        }
      } catch (err) {
        router.replace("/dashboard");
      }
    };

    checkUserCredits();
  }, [isLoaded, isSignedIn, user, router]);

  const handleFormChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const validateForm = () => {
    if (!formData.topic) {
      setError("Please fill in all fields.");
      return false;
    }
    return true;
  };

  const generateCourseOutline = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    const courseId = uuidv4();

    try {
      await axios.post("/api/generate-course-outline", {
        courseId,
        topic: formData?.topic,
        courseType: formData?.purpose,
        difficultyLevel: formData?.difficulty,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      });

      router.replace("/dashboard");
    } catch (err) {
      const status = err.response?.status || 500;
      if (status === 400 || status === 500) {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-5 md:px-24 lg:px-36 justify-center min-h-screen">
      <h2 className="font-bold text-center text-4xl text-primary">
        Start Building Your Personal Study Material
      </h2>
      <p className="text-gray-400 text-center">
        Fill all details to generate study material for your next project
      </p>
      <div>
        {steps === 0 ? (
          <SelectOption
            setSteps={setSteps}
            setSelected={(value) => handleFormChange("purpose", value)}
          />
        ) : (
          <TopicInput
            topic={formData.topic}
            difficulty={formData.difficulty}
            onTopicChange={(value) => handleFormChange("topic", value)}
            onDifficultyChange={(value) => handleFormChange("difficulty", value)}
          />
        )}
      </div>
      <div className="flex w-full mt-10">
        {steps === 0 ? null : (
          <div className="flex justify-between w-full items-center">
            <Button
              onClick={() => setSteps(steps - 1)}
              className="shadow-lg hover:bg-slate-200"
              variant="outline"
              disabled={loading}
            >
              Previous
            </Button>
            <Button
              onClick={() => {
                setSteps(steps + 1);
                generateCourseOutline();
              }}
              className={`shadow-lg flex items-center ${loading ? "cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <span className="loader border-white border-2 border-t-transparent rounded-full w-5 h-5 mr-2 animate-spin"></span>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Error Dialog */}
      {error && (
        <AlertDialog open={!!error} onOpenChange={() => setError("")}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Error</AlertDialogTitle>
              <AlertDialogDescription>{error}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setError("")}>Close</AlertDialogAction>
              <AlertDialogAction onClick={generateCourseOutline}>Retry</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default Create;
