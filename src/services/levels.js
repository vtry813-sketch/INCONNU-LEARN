import api from './api';

// Sample level data (in production, this would come from the backend)
export const sampleLevels = [
  {
    id: 1,
    levelNumber: 1,
    title: "JavaScript Basics",
    description: "Learn the fundamental concepts of JavaScript programming",
    difficulty: "beginner",
    coinsRequired: 0,
    coinsReward: 10,
    isUnlocked: true,
    lessons: [
      {
        id: 1,
        title: "What is JavaScript?",
        description: "Introduction to JavaScript and its capabilities",
        theory: `
          <h2>Welcome to JavaScript!</h2>
          <p>JavaScript is a programming language that makes web pages interactive. It was created in 1995 and has become one of the most popular programming languages in the world.</p>
          
          <h3>What can JavaScript do?</h3>
          <ul>
            <li>Create dynamic web content</li>
            <li>Handle user interactions</li>
            <li>Validate form data</li>
            <li>Create animations and effects</li>
            <li>Build web applications</li>
          </ul>
          
          <h3>Basic Syntax</h3>
          <pre><code>// This is a comment
console.log("Hello, World!"); // Output: Hello, World!</code></pre>
        `,
        exercises: [
          {
            id: "ex1-1",
            type: "quiz",
            title: "JavaScript Basics Quiz",
            description: "Test your understanding of JavaScript fundamentals",
            questions: [
              {
                question: "What is JavaScript primarily used for?",
                options: [
                  "Styling web pages",
                  "Making web pages interactive",
                  "Creating databases",
                  "Designing graphics"
                ],
                correctAnswer: 1
              },
              {
                question: "Which keyword is used to output data in JavaScript?",
                options: [
                  "print",
                  "echo",
                  "console.log",
                  "output"
                ],
                correctAnswer: 2
              }
            ],
            hint: "Think about what happens when you click buttons on websites"
          }
        ]
      }
    ]
  }
  // More levels would be defined here...
];

export const levelService = {
  getLevels: async () => {
    try {
      const response = await api.get('/levels');
      return response.data;
    } catch (error) {
      console.error('Error fetching levels:', error);
      // Fallback to sample data if API fails
      return sampleLevels;
    }
  },

  getLevel: async (id) => {
    try {
      const response = await api.get(`/levels/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching level:', error);
      // Fallback to sample data
      return sampleLevels.find(level => level.id === parseInt(id));
    }
  },

  unlockLevel: async (levelId) => {
    const response = await api.post(`/users/unlock-level/${levelId}`);
    return response.data;
  },

  completeLesson: async (levelId, lessonId, score) => {
    const response = await api.post(`/levels/${levelId}/complete-lesson`, {
      lessonId,
      score
    });
    return response.data;
  }
};
