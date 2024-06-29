const TelegramBot = require('node-telegram-bot-api');

// Telegram bot token obtained from BotFather
const token = '7363907617:AAHlNxW8P6M-wLYsvvRuOsY4yb9oGOjXQic';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Quiz data: questions and answers
const quiz = [
  {
    question: 'Fransiyaning poytaxti qayer?',
    options: ['Parij', 'London', 'Berlin', 'Rum'],
    correctAnswer: 'Parij'
  },
  {
    question: "O'zbekiston nechanchi yil mustaqil bo'lgan?",
    options: ['1992', '1991', '1995', '1998'],
    correctAnswer: '1991'
  },
  {
    question: 'Quyosh sistemamizdagi eng katta sayyora qaysi?',
    options: ['Yer', 'Jupiter', 'Saturn', 'Mars'],
    correctAnswer: 'Jupiter'
  }
];

// Object to store user quiz state
const quizState = {};

// Listener for incoming messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  if (msg.text.toLowerCase() === '/start') {
    startQuiz(chatId);
  } else if (quizState[chatId]) {
    handleQuizAnswer(chatId, msg.text);
  } else {
    bot.sendMessage(chatId, 'Type /start to begin the quiz.');
  }
});

// Function to start the quiz for a user
function startQuiz(chatId) {
  quizState[chatId] = {
    currentQuestion: 0,
    correctAnswers: 0
  };

  sendQuestion(chatId);
}

// Function to send the current question to a user
function sendQuestion(chatId) {
  const currentQuestion = quizState[chatId].currentQuestion;
  const question = quiz[currentQuestion].question;
  const options = quiz[currentQuestion].options;

  bot.sendMessage(chatId, `${question}\n\nOptions:\n${options.join('\n')}`);
}

// Function to handle user's answer to the current question
function handleQuizAnswer(chatId, answer) {
  const currentQuestion = quizState[chatId].currentQuestion;
  const correctAnswer = quiz[currentQuestion].correctAnswer;

  if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
    quizState[chatId].correctAnswers++;
    bot.sendMessage(chatId, "To'g'ri javob! 🎉");
  } else {
    bot.sendMessage(chatId, `Afsuz. 😞 To'g'ri javob: ${correctAnswer} edi`);
  }

  // Move to the next question or finish the quiz
  quizState[chatId].currentQuestion++;

  if (quizState[chatId].currentQuestion < quiz.length) {
    sendQuestion(chatId);
  } else {
    const totalQuestions = quiz.length;
    const correctAnswers = quizState[chatId].correctAnswers;
    const incorrectAnswers = totalQuestions - correctAnswers;

    bot.sendMessage(chatId, `Viktorina tugadi!\n\nTo'g'ri javoblar: ${correctAnswers}\nNotog'ri javoblar: ${incorrectAnswers}`);
    delete quizState[chatId]; // Clear quiz state for the user
  }
}

// Log when bot is successfully started
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('Bot started successfully!');
