// components/interview/InterviewProgress.jsx
export default function InterviewProgress({ currentQuestionIndex, totalQuestions }) {
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    
    return (
      <div className="mt-2">
        <div className="flex justify-between text-xs text-zinc-500 mb-1">
          <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-orange-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }
  