// hooks/useInterview.js
import { useState } from 'react';
import { generateInterviewQuestions, assessAnswers } from '../utils/api';

export default function useInterview() {
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [assessment, setAssessment] = useState(null);
  
  const startInterview = async (topic) => {
    setCurrentTopic(topic);
    setIsInterviewStarted(true);
    setIsLoading(true);
    
    const generatedQuestions = await generateInterviewQuestions(topic);
    setQuestions(generatedQuestions);
    
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setIsLoading(false);
    
    return generatedQuestions;
  };
  
  const saveAnswer = (answer) => {
    const currentAnswer = {
      question: questions[currentQuestionIndex],
      answer
    };
    
    setUserAnswers(prev => [...prev, currentAnswer]);
    
    if (currentQuestionIndex >= questions.length - 1) {
      return true; // Last question
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      return false;
    }
  };
  
  const startAssessment = async () => {
    setIsLoading(true);
    const assessmentData = await assessAnswers(currentTopic, userAnswers);
    setAssessment(assessmentData);
    setIsLoading(false);
    setInterviewCompleted(true);
  };
  
  const resetInterview = () => {
    setIsInterviewStarted(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setInterviewCompleted(false);
    setAssessment(null);
    setCurrentTopic('');
  };
  
  return {
    isInterviewStarted,
    currentTopic,
    questions,
    currentQuestionIndex,
    isLoading,
    interviewCompleted,
    assessment,
    startInterview,
    saveAnswer,
    startAssessment,
    resetInterview
  };
}
