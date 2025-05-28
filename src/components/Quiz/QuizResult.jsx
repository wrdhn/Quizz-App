import { useEffect } from 'react'
import {
  Card,
  Button,
  Row,
  Col,
  Badge,
  ProgressBar,
  Table,
} from 'react-bootstrap'
import { useQuiz } from '../../contexts/QuizContext'
import { useNavigate } from 'react-router-dom'

function QuizResult() {
  const { questions, userAnswers, score, quizFinished, resetQuiz } = useQuiz()

  const navigate = useNavigate()

  // redirect if no quiz data
  useEffect(() => {
    if (!questions.length || !quizFinished) {
      navigate('/')
    }
  }, [questions.length, quizFinished, navigate])

  const handleRestart = () => {
    resetQuiz()
    navigate('/')
  }

  const getScoreColor = percentage => {
    if (percentage >= 80) return 'success'
    if (percentage >= 60) return 'warning'
    return 'danger'
  }

  const getScoreMessage = percentage => {
    if (percentage >= 90) return 'Excellent! 🎉'
    if (percentage >= 80) return 'Very good! 👏'
    if (percentage >= 70) return 'Good! 👍'
    if (percentage >= 60) return 'Fairly good 👌'
    if (percentage >= 50) return 'Not bad 😊'
    return 'Needs more practice 📚'
  }

  const getAnswerStatus = (userAnswer, correctAnswer) => {
    if (!userAnswer)
      return {
        icon: 'bi-dash-circle',
        color: 'secondary',
        text: 'Tidak dijawab',
      }
    if (userAnswer === correctAnswer)
      return { icon: 'bi-check-circle-fill', color: 'success', text: 'Correct' }
    return { icon: 'bi-x-circle-fill', color: 'danger', text: 'Wrong' }
  }

  if (!questions.length) {
    return null
  }

  return (
    <div className='max-width-1000 mx-auto'>
      {/* score summary */}
      <Card className='shadow mb-4'>
        <Card.Header className='bg-white text-center border-bottom'>
          <h3 className='mb-0 text-green'>Quiz Results</h3>
        </Card.Header>

        <Card.Body className='text-center p-5'>
          <div className='mb-4'>
            <div
              className={`display-1 fw-bold text-${getScoreColor(score.percentage)} mb-2`}
            >
              {score.percentage}%
            </div>
            <h4 className='text-muted mb-3'>
              {score.score} out of {score.total} questions correct
            </h4>
            <h5 className='mb-4'>{getScoreMessage(score.percentage)}</h5>
          </div>

          <ProgressBar
            now={score.percentage}
            variant={getScoreColor(score.percentage)}
            style={{ height: '15px' }}
            className='mb-4'
          />

          <Row className='text-center'>
            <Col md={4}>
              <div className='border-end'>
                <div className='h4 text-success mb-1'>{score.score}</div>
                <small className='text-muted'>Correnct</small>
              </div>
            </Col>
            <Col md={4}>
              <div className='border-end'>
                <div className='h4 text-danger mb-1'>
                  {score.total - score.score}
                </div>
                <small className='text-muted'>Wrong</small>
              </div>
            </Col>
            <Col md={4}>
              <div className='h4 text-primary mb-1'>{score.total}</div>
              <small className='text-muted'>Total</small>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* detailed result */}
      <Card className='shadow mb-4'>
        <Card.Header className='bg-white border-bottom'>
          <h5 className='mb-0'>
            <i className='bi bi-list-check me-2'></i>
            Answer Details
          </h5>
        </Card.Header>

        <Card.Body className='p-0'>
          <Table responsive className='mb-0'>
            <thead className='table-light'>
              <tr>
                <th style={{ width: '60px' }}>No</th>
                <th>Question</th>
                <th style={{ width: '150px' }}>Your Answer</th>
                <th style={{ width: '150px' }}>Correct Answer</th>
                <th style={{ width: '100px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question, index) => {
                const userAnswer = userAnswers[index]
                const status = getAnswerStatus(
                  userAnswer,
                  question.correct_answer
                )

                return (
                  <tr key={question.id}>
                    <td className='text-center fw-bold'>{index + 1}</td>
                    <td>
                      <div
                        className='small'
                        dangerouslySetInnerHTML={{ __html: question.question }}
                      />
                      <div className='mt-1'>
                        <Badge bg='secondary' className='me-1'>
                          {question.category}
                        </Badge>
                        <Badge
                          bg={
                            question.difficulty === 'easy'
                              ? 'success'
                              : question.difficulty === 'medium'
                                ? 'warning'
                                : 'danger'
                          }
                        >
                          {question.difficulty === 'easy'
                            ? 'Easy'
                            : question.difficulty === 'medium'
                              ? 'Medium'
                              : 'Hard'}
                        </Badge>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`text-${status.color}`}
                        dangerouslySetInnerHTML={{
                          __html: userAnswer || '-',
                        }}
                      />
                    </td>
                    <td>
                      <span
                        className='text-success'
                        dangerouslySetInnerHTML={{
                          __html: question.correct_answer,
                        }}
                      />
                    </td>
                    <td>
                      <Badge bg={status.color}>
                        <i className={`${status.icon} me-1`}></i>
                        {status.text}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* action buttons */}
      <div className='text-center'>
        <Button className='green-btn' size='lg' onClick={handleRestart}>
          <i className='bi bi-arrow-repeat me-2'></i>
          Retake Quiz
        </Button>
      </div>
    </div>
  )
}

export default QuizResult
