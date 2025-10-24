const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Initialize admin user if not exists
    await initializeAdminUser();
    
    // Initialize levels if not exists
    await initializeLevels();
    
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const initializeAdminUser = async () => {
  try {
    const User = require('../models/User');
    const existingAdmin = await User.findOne({ email: 'inconnuboytech@gmail.com' });
    
    if (!existingAdmin) {
      const adminUser = new User({
        name: 'Inconnu Boy',
        email: 'inconnuboytech@gmail.com',
        password: 'inconnuboytech1234',
        coins: 9999999999,
        isAdmin: true,
        unlockedLevels: Array.from({ length: 50 }, (_, i) => i + 1)
      });
      
      await adminUser.save();
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error initializing admin user:', error);
  }
};

const initializeLevels = async () => {
  try {
    const Level = require('../models/Level');
    const levelCount = await Level.countDocuments();
    
    if (levelCount === 0) {
      console.log('Initializing levels...');
      
      const levels = [
        {
          levelNumber: 1,
          title: 'JavaScript Basics',
          description: 'Learn the fundamental concepts of JavaScript',
          difficulty: 'beginner',
          coinsReward: 10,
          lessons: [
            {
              title: 'What is JavaScript?',
              description: 'Introduction to JavaScript and its capabilities',
              theory: '<h2>Welcome to JavaScript!</h2><p>JavaScript is a programming language that makes web pages interactive...</p>',
              exercises: [
                {
                  type: 'quiz',
                  title: 'JavaScript Basics Quiz',
                  description: 'Test your understanding of JavaScript fundamentals',
                  questions: [
                    {
                      question: 'What is JavaScript primarily used for?',
                      options: [
                        'Styling web pages',
                        'Making web pages interactive',
                        'Creating databases',
                        'Designing graphics'
                      ],
                      correctAnswer: 1
                    }
                  ],
                  hint: 'Think about what happens when you click buttons on websites'
                }
              ]
            }
          ]
        }
        // Add more levels here...
      ];
      
      await Level.insertMany(levels);
      console.log('Levels initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing levels:', error);
  }
};

module.exports = connectDB;
