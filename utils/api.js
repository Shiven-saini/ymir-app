// utils/api.js
export async function generateInterviewQuestions(topic) {
    try {
      const response = await fetch('/api/deepseek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `You are an expert interviewer for technical assessments. Generate 10 interview questions about ${topic}. 
          Include a mix of technical and scenario-based questions, ranging from basic to intermediate difficulty.
          Format the response as a JSON array of strings, with each string being a complete question. 
          Do not include answers, explanations, or any text other than the questions themselves.
          Example format: ["Question 1 text here?", "Question 2 text here?", ...]`
        })
      });
      
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      
      try {
        const content = result.data.choices[0].message.content;
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        const jsonStr = jsonMatch ? jsonMatch[0] : content;
        return JSON.parse(jsonStr);
      } catch (e) {
        console.error("Failed to parse questions:", e);
        return getFallbackQuestions(topic);
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      return getFallbackQuestions(topic);
    }
  }
  
  export async function assessAnswers(topic, userAnswers) {
    try {
      const assessmentPrompt = `
        I've conducted an interview on ${topic} with a candidate. 
        Please assess the technical accuracy of their answers to the following questions.
        Ignore grammatical or spelling mistakes, focus only on technical correctness.
        
        ${userAnswers.map((qa, index) => 
          `Question ${index + 1}: ${qa.question}\nAnswer: ${qa.answer}`
        ).join('\n\n')}
        
        For each answer, provide:
        1. A score out of 10 based solely on technical accuracy
        2. A brief explanation of what was good and what could be improved
        
        Also provide an overall score out of 100 and a summary assessment.
        
        Format your response as JSON:
        {
          "questionAssessments": [
            {
              "questionNumber": 1,
              "score": 8,
              "feedback": "Good explanation of X, but missed Y concept."
            },
            ...
          ],
          "overallScore": 85,
          "summary": "Overall assessment text here"
        }
      `;
      
      const response = await fetch('/api/deepseek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: assessmentPrompt })
      });
      
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      
      try {
        const content = result.data.choices[0].message.content;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : content;
        return JSON.parse(jsonStr);
      } catch (e) {
        console.error("Failed to parse assessment:", e);
        return getDefaultAssessment(userAnswers);
      }
    } catch (error) {
      console.error("Error assessing answers:", error);
      return getDefaultAssessment(userAnswers);
    }
  }
  
  function getFallbackQuestions(topic) {
    return [
      `Tell me about your experience with ${topic}?`,
      `What are the main challenges in ${topic}?`,
      `Explain a key concept in ${topic}`,
      `How would you solve a common problem in ${topic}?`,
      `What tools or frameworks do you use for ${topic}?`,
      `Describe a project you've worked on related to ${topic}`,
      `What's your approach to learning new concepts in ${topic}?`,
      `How do you stay updated with the latest trends in ${topic}?`,
      `What's the most complex issue you've solved in ${topic}?`,
      `Where do you see ${topic} evolving in the next few years?`
    ];
  }
  
  function getDefaultAssessment(userAnswers) {
    return {
      questionAssessments: userAnswers.map((_, i) => ({
        questionNumber: i + 1,
        score: 7,
        feedback: "Unable to assess this answer properly."
      })),
      overallScore: 70,
      summary: "Assessment failed. Please try again."
    };
  }
  