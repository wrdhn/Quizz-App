import { createContext, useContext, useReducer, useEffect, useRef } from 'react'
import { quizService } from '../services/quizService'

const QuizContext = createContext()

const QUIZ_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_CONFIG: 'SET_CONFIG',
  SET_QUESTIONS: 'SET_QUESTIONS',
  SET_CURRENT_QUESTION: 'SET_CURRENT_QUESTION',
  SET_USER_ANSWER: 'SET_USER_ANSWER',
  NEXT_QUESTION: 'NEXT_QUESTION',
  FINISH_QUIZ: 'FINISH_QUIZ',
  RESET_QUIZ: 'RESET_QUIZ',
  SET_ERROR: 'SET_ERROR',
  START_TIMER: 'START_TIMER',
  TICK_TIMER: 'TICK_TIMER',
  LOAD_SAVED_PROGRESS: 'LOAD_SAVED_PROGRESS',
}

const calculateTotalTime = (difficulty, amount) => {
  const baseTimePerQuestion = {
    easy: 30,
    medium: 60,
    hard: 120,
  }
  return (baseTimePerQuestion[difficulty] || 60) * amount
}

const initialState = {
  loading: false,
  error: null,
  categories: [],

  config: {
    amount: 10,
    category: '',
    difficulty: 'medium',
    type: '',
  },

  questions: [],
  currentQuestionIndex: 0,
  userAnswers: [],

  quizStarted: false,
  quizFinished: false,

  timeLeft: 600,
  totalTime: 600,
  timerActive: false,
}

function quizReducer(state, action) {
  switch (action.type) {
    case QUIZ_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }

    case QUIZ_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false }

    case QUIZ_ACTIONS.SET_CATEGORIES:
      return { ...state, categories: action.payload, loading: false }

    case QUIZ_ACTIONS.SET_CONFIG: {
      const newConfig = { ...state.config, ...action.payload }
      const totalTime = calculateTotalTime(
        newConfig.difficulty,
        newConfig.amount
      )
      return {
        ...state,
        config: newConfig,
        timeLeft: totalTime,
        totalTime: totalTime,
      }
    }

    case QUIZ_ACTIONS.SET_QUESTIONS: {
      const totalTime = calculateTotalTime(
        state.config.difficulty,
        action.payload.length
      )
      return {
        ...state,
        questions: action.payload,
        userAnswers: new Array(action.payload.length).fill(null),
        currentQuestionIndex: 0,
        quizStarted: true,
        quizFinished: false,
        timeLeft: totalTime,
        totalTime: totalTime,
        timerActive: true,
        loading: false,
        error: null,
      }
    }

    case QUIZ_ACTIONS.SET_USER_ANSWER: {
      const newAnswers = [...state.userAnswers]
      newAnswers[state.currentQuestionIndex] = action.payload
      return { ...state, userAnswers: newAnswers }
    }

    case QUIZ_ACTIONS.NEXT_QUESTION: {
      const nextIndex = state.currentQuestionIndex + 1
      const isLastQuestion = nextIndex >= state.questions.length

      return {
        ...state,
        currentQuestionIndex: nextIndex,
        timerActive: !isLastQuestion,
        quizFinished: isLastQuestion,
      }
    }

    case QUIZ_ACTIONS.FINISH_QUIZ:
      return {
        ...state,
        quizFinished: true,
        timerActive: false,
      }

    case QUIZ_ACTIONS.RESET_QUIZ: {
      const totalTime = calculateTotalTime(
        state.config.difficulty,
        state.config.amount
      )
      return {
        ...initialState,
        categories: state.categories, // keep categories
        config: state.config, // keep config
        timeLeft: totalTime,
        totalTime: totalTime,
      }
    }

    case QUIZ_ACTIONS.START_TIMER:
      return { ...state, timerActive: true }

    case QUIZ_ACTIONS.TICK_TIMER: {
      const newTimeLeft = Math.max(0, state.timeLeft - 1)
      return {
        ...state,
        timeLeft: newTimeLeft,
        timerActive: newTimeLeft > 0 && !state.quizFinished,
      }
    }

    case QUIZ_ACTIONS.LOAD_SAVED_PROGRESS: {
      const {
        questions,
        userAnswers,
        currentQuestionIndex,
        config,
        timeLeft,
        totalTime,
      } = action.payload
      return {
        ...state,
        questions,
        userAnswers,
        currentQuestionIndex,
        config,
        timeLeft,
        totalTime,
        quizStarted: true,
        quizFinished: false,
        timerActive: timeLeft > 0,
        loading: false,
        error: null,
      }
    }

    default:
      return state
  }
}

export function useQuiz() {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider')
  }
  return context
}

export function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(quizReducer, initialState)

  const isLoadingProgress = useRef(false)

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    let interval = null

    if (state.timerActive && state.timeLeft > 0 && !state.quizFinished) {
      interval = setInterval(() => {
        dispatch({ type: QUIZ_ACTIONS.TICK_TIMER })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [state.timerActive, state.timeLeft, state.quizFinished])

  useEffect(() => {
    if (state.timeLeft === 0 && !state.quizFinished && state.quizStarted) {
      const timer = setTimeout(() => {
        dispatch({ type: QUIZ_ACTIONS.FINISH_QUIZ })
      }, 100)

      console.info('Timer expired, finishing quiz...')
      return () => clearTimeout(timer)
    }
  }, [state.timeLeft, state.quizFinished, state.quizStarted])

  useEffect(() => {
    if (
      state.quizStarted &&
      !state.quizFinished &&
      state.questions.length > 0 &&
      !isLoadingProgress.current
    ) {
      const user = userFromLocalStorage()

      const progress = {
        questions: state.questions,
        user: user,
        userAnswers: state.userAnswers,
        currentQuestionIndex: state.currentQuestionIndex,
        config: state.config,
        timeLeft: state.timeLeft,
        totalTime: state.totalTime,
        timestamp: Date.now(),
      }
      localStorage.setItem('quiz_progress', JSON.stringify(progress))
      console.info('Quiz progress saved to localStorage')
    }
  }, [
    state.currentQuestionIndex,
    state.userAnswers,
    state.quizStarted,
    state.quizFinished,
    state.questions.length,
  ])

  const userFromLocalStorage = () => {
    const user = localStorage.getItem('user')
    const userParsed = JSON.parse(user)
    return userParsed
  }

  const loadCategories = async () => {
    dispatch({ type: QUIZ_ACTIONS.SET_LOADING, payload: true })

    const result = await quizService.getCategories()

    if (result.success) {
      dispatch({ type: QUIZ_ACTIONS.SET_CATEGORIES, payload: result.data })
    } else {
      dispatch({ type: QUIZ_ACTIONS.SET_ERROR, payload: result.error })
    }
  }

  const setConfig = config => {
    dispatch({ type: QUIZ_ACTIONS.SET_CONFIG, payload: config })
  }

  const startQuiz = async config => {
    dispatch({ type: QUIZ_ACTIONS.SET_LOADING, payload: true })

    const configToUse = config || state.config
    const { amount, category, difficulty, type } = configToUse
    const result = await quizService.getQuestions(
      amount,
      category,
      difficulty,
      type
    )

    if (result.success) {
      dispatch({ type: QUIZ_ACTIONS.SET_QUESTIONS, payload: result.data })
    } else {
      dispatch({ type: QUIZ_ACTIONS.SET_ERROR, payload: result.error })
    }
  }

  const answerQuestion = answer => {
    dispatch({ type: QUIZ_ACTIONS.SET_USER_ANSWER, payload: answer })

    // auto advance to next question after a short delay
    setTimeout(() => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        dispatch({ type: QUIZ_ACTIONS.NEXT_QUESTION })
      } else {
        dispatch({ type: QUIZ_ACTIONS.FINISH_QUIZ })
      }
    }, 1000)
  }

  const nextQuestion = () => {
    dispatch({ type: QUIZ_ACTIONS.NEXT_QUESTION })
  }

  const finishQuiz = () => {
    dispatch({ type: QUIZ_ACTIONS.FINISH_QUIZ })
    localStorage.removeItem('quiz_progress')
  }

  const resetQuiz = () => {
    dispatch({ type: QUIZ_ACTIONS.RESET_QUIZ })
    localStorage.removeItem('quiz_progress')
    console.info('Quiz restrart and progress cleared from localStorage')
  }

  const loadSavedProgress = () => {
    if (isLoadingProgress.current) {
      return false
    }

    const saved = localStorage.getItem('quiz_progress')
    const userLocalStorage = userFromLocalStorage()
    if (saved) {
      try {
        const progress = JSON.parse(saved)
        const { user } = progress
        if (user !== userLocalStorage) {
          return false
        } else if (Date.now() - progress.timestamp < 7200000) {
          isLoadingProgress.current = true

          dispatch({
            type: QUIZ_ACTIONS.LOAD_SAVED_PROGRESS,
            payload: progress,
          })

          return true
        } else {
          localStorage.removeItem('quiz_progress')
        }
      } catch (error) {
        console.error('Error loading saved progress:', error)
        localStorage.removeItem('quiz_progress')
      }
    }
    return false
  }

  const calculateScore = () => {
    if (!state.questions.length) return { score: 0, total: 0, percentage: 0 }

    let correct = 0
    state.userAnswers.forEach((answer, index) => {
      if (answer === state.questions[index]?.correct_answer) {
        correct++
      }
    })

    const total = state.questions.length
    const percentage = Math.round((correct / total) * 100)

    return { score: correct, total, percentage }
  }

  const getCurrentQuestion = () => {
    return state.questions[state.currentQuestionIndex] || null
  }

  const value = {
    ...state,

    currentQuestion: getCurrentQuestion(),
    score: calculateScore(),

    loadCategories,
    setConfig,
    startQuiz,
    answerQuestion,
    nextQuestion,
    finishQuiz,
    resetQuiz,
    loadSavedProgress,
  }

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}
