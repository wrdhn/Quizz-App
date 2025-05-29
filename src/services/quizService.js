import axios from 'axios'

const quizApi = axios.create({
  baseURL: 'https://opentdb.com/api.php',
  timeout: 10000,
})

export const quizService = {
  getCategories: async () => {
    try {
      const response = await axios.get('https://opentdb.com/api_category.php')
      return {
        success: true,
        data: response.data.trivia_categories,
      }
    } catch {
      return {
        success: false,
        error: 'Failed to take the question category',
      }
    }
  },

  getQuestions: async (
    amount = 10,
    category = '',
    difficulty = '',
    type = ''
  ) => {
    try {
      const params = {
        amount,
        encode: 'url3986',
      }

      if (category) params.category = category
      if (difficulty) params.difficulty = difficulty
      if (type) params.type = type

      const response = await quizApi.get('', { params })

      if (response.data.response_code !== 0) {
        throw new Error('Failed to retrieve questions from server')
      }

      // decode URL encoding and shuffle answers
      const questions = response.data.results.map((question, index) => ({
        id: index + 1,
        category: decodeURIComponent(question.category),
        type: question.type,
        difficulty: question.difficulty,
        question: decodeURIComponent(question.question),
        correct_answer: decodeURIComponent(question.correct_answer),
        incorrect_answers: question.incorrect_answers.map(answer =>
          decodeURIComponent(answer)
        ),
        all_answers: shuffleArray([
          decodeURIComponent(question.correct_answer),
          ...question.incorrect_answers.map(answer =>
            decodeURIComponent(answer)
          ),
        ]),
      }))

      return {
        success: true,
        data: questions,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to take the question',
      }
    }
  },
}

// helper function for shuffle array
function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
