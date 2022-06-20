const express = require('express')
const { urlencoded, json } = require('body-parser')
const makeRepositories = require('./middleware/repositories')

const STORAGE_FILE_PATH = 'questions.json'
const PORT = 3000

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))

app.get('/', (_, res) => {
  res.json({ message: 'Welcome to responder!' })
})

app.get('/questions', async (req, res) => {
  const questions = await req.repositories.questionRepo.getQuestions()
  res.json(questions)
})

app.get('/questions/:questionId', async (req, res) => {
  const id = req.params.questionId
  const question = await req.repositories.questionRepo.getQuestionById(id)
  res.json(question)
 
})

app.post('/questions', async (req, res) => {
  const question = await req.repositories.questionRepo.addQuestion()
  res.json(question)

})

app.get('/questions/:questionId/answers', async (req, res) => {
  const id = req.params.questionId
  const answers = await req.repositories.questionRepo.getAnswers(id)
  res.json(answers)
})

app.post('/questions/:questionId/answers', async (req, res) => {
  const id = req.params.questionId
  let newAnswer = req.body.answer
  const answer = await req.repositories.questionRepo.addAnswer(id, newAnswer)

  res.json({questionId: id, answer: answer})

})

app.get('/questions/:questionId/answers/:answerId', async (req, res) => {
  const qId = req.params.questionId
  const aId = req.params.answerId
  const answer = await req.repositories.questionRepo.getAnswer(qId, aId)
  res.json(answer)
})

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})
