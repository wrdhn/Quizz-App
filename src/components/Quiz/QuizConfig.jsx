import { useState, useEffect } from 'react'
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
  Modal,
} from 'react-bootstrap'
import { useQuiz } from '../../contexts/QuizContext'
import { useNavigate } from 'react-router-dom'

function QuizConfig() {
  const {
    categories,
    config,
    loading,
    error,
    setConfig,
    startQuiz,
    loadSavedProgress,
  } = useQuiz()

  const navigate = useNavigate()
  const [localConfig, setLocalConfig] = useState(config)
  const [startingQuiz, setStartingQuiz] = useState(false)
  const [showResumeModal, setShowResumeModal] = useState(false)

  useEffect(() => {
    // check for saved progress when component mounts
    const hasSavedProgress = loadSavedProgress()
    if (hasSavedProgress) {
      setShowResumeModal(true)
    }
  }, [loadSavedProgress])

  const handleConfigChange = (field, value) => {
    setLocalConfig(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setStartingQuiz(true)

    setConfig(localConfig)
    await startQuiz(localConfig)

    if (!error) {
      navigate('/quiz')
    }

    setStartingQuiz(false)
  }

  const handleResume = () => {
    setShowResumeModal(false)
    navigate('/quiz')
  }

  const handleStartNew = () => {
    localStorage.removeItem('quiz_progress')
    setShowResumeModal(false)
  }

  const difficultyOptions = [
    { value: 'easy', label: 'Easy', time: 5 },
    { value: 'medium', label: 'Medium', time: 10 },
    { value: 'hard', label: 'Hard', time: 20 },
  ]

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'multiple', label: 'Multiple Choice' },
    { value: 'boolean', label: 'True/False' },
  ]

  const amountOptions = [10, 20, 30, 40, 50]
  const getTotalTime = () => {
    const timeMultiplier = {
      easy: 0.5,
      medium: 1,
      hard: 2,
    }
    const multiplier = timeMultiplier[localConfig.difficulty] || 1
    return Math.ceil((localConfig.amount * multiplier * 60) / 60)
  }

  return (
    <div className='d-flex justify-content-center'>
      <Card className='shadow' style={{ maxWidth: '600px', width: '100%' }}>
        <Card.Header className='bg-white border-bottom'>
          <h4 className='mb-0 mx-5 text-center text-green'>
            What kind of quiz would you like?
          </h4>
        </Card.Header>

        <Card.Body className='p-4'>
          {error && <Alert variant='danger'>{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className='mb-4'>
                  <Form.Label className='fw-semibold ms-2'>
                    <i className='bi bi-list-ol me-2'></i>
                    Number of Questions
                  </Form.Label>
                  <Form.Select
                    value={localConfig.amount}
                    onChange={e =>
                      handleConfigChange('amount', parseInt(e.target.value))
                    }
                    disabled={loading || startingQuiz}
                    className='form-select-lg border-2'
                  >
                    {amountOptions.map(amount => (
                      <option key={amount} value={amount}>
                        {amount} Question
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className='mb-4'>
                  <Form.Label className='fw-semibold ms-2'>
                    <i className='bi bi-speedometer2 me-2'></i>
                    Difficulty level
                  </Form.Label>
                  <Form.Select
                    value={localConfig.difficulty}
                    onChange={e =>
                      handleConfigChange('difficulty', e.target.value)
                    }
                    disabled={loading || startingQuiz}
                    className='form-select-lg border-2'
                  >
                    {difficultyOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className='mb-4'>
              <Form.Label className='fw-semibold ms-2'>
                <i className='bi bi-folder me-2'></i>
                Category
              </Form.Label>
              <Form.Select
                value={localConfig.category}
                onChange={e => handleConfigChange('category', e.target.value)}
                disabled={loading || startingQuiz}
                className='form-select-lg border-2'
              >
                <option value=''>All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
              {loading && categories.length === 0 && (
                <Form.Text className='text-muted'>
                  <Spinner animation='border' size='sm' className='me-2' />
                  Loading Categories...
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className='mb-4'>
              <Form.Label className='fw-semibold ms-2'>
                <i className='bi bi-question-circle me-2'></i>
                Question Type
              </Form.Label>
              <Form.Select
                value={localConfig.type}
                onChange={e => handleConfigChange('type', e.target.value)}
                disabled={loading || startingQuiz}
                className='form-select-lg border-2'
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Time Summary */}
            <Alert variant='light' className='border-2 bg-light'>
              <div className='d-flex align-items-center'>
                <i className='bi bi-clock-fill text-success me-2'></i>
                <span className='fw-semibold text-success'>
                  Total time: {getTotalTime()} minutes per {localConfig.amount}{' '}
                  question
                </span>
              </div>
            </Alert>

            <div className='d-grid gap-2 mt-4'>
              <Button
                type='submit'
                size='lg'
                variant='success'
                disabled={loading || startingQuiz}
                className='config-btn btn-primary'
              >
                {startingQuiz ? (
                  <>
                    <Spinner animation='border' size='sm' className='me-2' />
                    Preparing Quiz...
                  </>
                ) : (
                  <>
                    <i className='bi bi-play-fill me-2'></i>
                    Start Quiz
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Resume Quiz Modal */}
      <Modal
        show={showResumeModal}
        onHide={() => setShowResumeModal(false)}
        backdrop='static'
        keyboard={false}
        centered
      >
        <Modal.Header className='text-dark'>
          <Modal.Title>
            <i className='bi bi-arrow-clockwise me-2'></i>
            Previous Quiz Found
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center py-4'>
          <i className='bi bi-question-circle-fill text-warning display-4 mb-3'></i>
          <p className='mb-4'>
            We found an unfinished quiz. Would you like to continue that quiz or
            start a new one?
          </p>
        </Modal.Body>
        <Modal.Footer className='justify-content-center'>
          <Button
            variant='outline-success'
            onClick={handleStartNew}
            className='me-2'
          >
            <i className='bi bi-plus-circle me-1'></i>
            Start New
          </Button>
          <Button className='btn-primary' onClick={handleResume}>
            <i className='bi bi-play-fill me-1'></i>
            Continue
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default QuizConfig
