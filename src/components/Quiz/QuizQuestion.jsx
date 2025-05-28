import { useState, useEffect } from 'react'
import { Card, ProgressBar, Badge, Alert, Row, Col } from 'react-bootstrap'
import { useQuiz } from '../../contexts/QuizContext'
import { useNavigate } from 'react-router-dom'

function QuizQuestion() {
  const {
    currentQuestion,
    currentQuestionIndex,
    questions,
    userAnswers,
    timeLeft,
    timerActive,
    quizFinished,
    answerQuestion,
    finishQuiz,
  } = useQuiz()

  const navigate = useNavigate()
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)

  useEffect(() => {
    if (!questions.length && !currentQuestion) {
      navigate('/')
      return
    }

    if (quizFinished) {
      navigate('/result')
      return
    }
  }, [questions.length, currentQuestion, quizFinished, navigate])

  useEffect(() => {
    if (timeLeft === 0 && timerActive) {
      finishQuiz()
    }
  }, [timeLeft, timerActive, finishQuiz])

  // reset selected answer when question changes
  useEffect(() => {
    setSelectedAnswer(null)
    setShowFeedback(false)
  }, [currentQuestionIndex])

  // auto-select previous answer if exists
  useEffect(() => {
    const previousAnswer = userAnswers[currentQuestionIndex]
    if (previousAnswer) {
      setSelectedAnswer(previousAnswer)
    }
  }, [currentQuestionIndex, userAnswers])

  const handleAnswerSelect = answer => {
    if (showFeedback) return

    setSelectedAnswer(answer)
    setShowFeedback(true)

    answerQuestion(answer)
  }

  const getAnswerButtonClass = answer => {
    let baseClass = 'btn w-100 text-start mb-2 p-3'

    if (!showFeedback) {
      if (selectedAnswer === answer) {
        baseClass += 'green-btn text-white'
      } else {
        baseClass += ' btn-outline'
      }
    } else {
      if (answer === currentQuestion.correct_answer) {
        baseClass += ' btn-success text-white'
      } else if (
        selectedAnswer === answer &&
        answer !== currentQuestion.correct_answer
      ) {
        baseClass += ' btn-danger text-white'
      } else {
        baseClass += ' btn-outline'
      }
    }

    return baseClass
  }

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  if (!currentQuestion) {
    return (
      <div className='text-center'>
        <Alert variant='warning'>No questions available</Alert>
      </div>
    )
  }

  return (
    <div className='max-width-800 mx-auto'>
      {/* Progress and Timer */}
      <Row className='mb-4'>
        <Col md={8}>
          <div className='mb-2'>
            <small className='text-muted'>
              Question {currentQuestionIndex + 1} of {questions.length}
            </small>
          </div>
          <ProgressBar
            now={progress}
            className='mb-2'
            style={{ height: '8px' }}
          />
        </Col>
        <Col md={4} className='text-end'>
          <div
            className={`fs-4 fw-bold ${timeLeft <= 10 ? 'timer-warning' : ''}`}
          >
            <i className='bi bi-clock me-2'></i>
            {formatTime(timeLeft)}
          </div>
        </Col>
      </Row>

      {/* Question Card */}
      <Card className='question-card shadow mb-4'>
        <Card.Header className='bg-white border-bottom'>
          <Row>
            <Col>
              <Badge bg='secondary' className='me-2'>
                {currentQuestion.category}
              </Badge>
              <Badge
                bg={
                  currentQuestion.difficulty === 'easy'
                    ? 'success'
                    : currentQuestion.difficulty === 'medium'
                      ? 'warning'
                      : 'danger'
                }
              >
                {currentQuestion.difficulty === 'easy'
                  ? 'Easy'
                  : currentQuestion.difficulty === 'medium'
                    ? 'Medium'
                    : 'Hard'}
              </Badge>
            </Col>
            <Col xs='auto'>
              <Badge bg='info'>
                {currentQuestion.type === 'multiple'
                  ? 'Multiple Choice'
                  : 'True/False'}
              </Badge>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body className='p-4'>
          <h5
            className='mb-4'
            dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
          />

          <div className='d-grid gap-2'>
            {currentQuestion.all_answers.map((answer, index) => (
              <button
                key={index}
                className={getAnswerButtonClass(answer)}
                onClick={() => handleAnswerSelect(answer)}
                disabled={showFeedback}
              >
                <div className='d-flex align-items-center'>
                  <span className='badge bg-light text-dark me-3'>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: answer }} />
                  {showFeedback &&
                    answer === currentQuestion.correct_answer && (
                      <i className='bi bi-check-circle-fill text-success ms-auto'></i>
                    )}
                  {showFeedback &&
                    selectedAnswer === answer &&
                    answer !== currentQuestion.correct_answer && (
                      <i className='bi bi-x-circle-fill text-danger ms-auto'></i>
                    )}
                </div>
              </button>
            ))}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <Alert
              variant={
                selectedAnswer === currentQuestion.correct_answer
                  ? 'success'
                  : 'danger'
              }
              className='mt-3'
            >
              {selectedAnswer === currentQuestion.correct_answer ? (
                <>
                  <i className='bi bi-check-circle me-2'></i>
                  Correct! Your answer is right.
                </>
              ) : (
                <>
                  <i className='bi bi-x-circle me-2'></i>
                  Incorrect! The correct answer is:{' '}
                  <strong>{currentQuestion.correct_answer}</strong>
                </>
              )}
            </Alert>
          )}
        </Card.Body>
      </Card>

      {/* Warning for low time */}
      {timeLeft <= 10 && timeLeft > 0 && (
        <Alert variant='warning' className='text-center'>
          <i className='bi bi-exclamation-triangle me-2'></i>
          Time is almost up!
        </Alert>
      )}
    </div>
  )
}

export default QuizQuestion
