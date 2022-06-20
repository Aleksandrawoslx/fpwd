const { readFile, writeFile } = require('fs/promises')
const { v4: uuidv4 } = require('uuid')

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    return questions
  }

  const getQuestionById = async questionId => {
    let fileContent = await readFile(fileName, { encoding: 'utf-8' })
    fileContent = JSON.parse(fileContent)

    return fileContent.filter(el => {
      return el.id === questionId
    })
  }
  const addQuestion = async question => {
    let newQuestion = question
    newQuestion.id = uuidv4()
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    fileContent = JSON.parse(fileContent)
    fileContent.push(newQuestion)
    fileContent = JSON.stringify(fileContent)

    writeFile(fileName, fileContent, err => {
      if (err) {
        console.error(err)
      }
      return 'Question added'
    })
  }
  const getAnswers = async questionId => {
    let fileContent = await readFile(fileName, { encoding: 'utf-8' })
    fileContent = JSON.parse(fileContent)
    let question = fileContent.filter(el => {
      return el.id === questionId
    })
    console.log(question)

    return JSON.stringify(question[0].answers)
  }
  const getAnswer = async (questionId, answerId) => {
    let fileContent = await readFile(fileName, { encoding: 'utf-8' })
    fileContent = JSON.parse(fileContent)
    let question = fileContent.filter(el => {
      return el.id === questionId
    })

    return question[0].answers.filter(el => {
      return el.id === answerId
    })
  }
  const addAnswer = async (questionId, answer) => {
    let newAnswer = JSON.parse(answer)

    let fileContent = await readFile(fileName, { encoding: 'utf-8' })
    fileContent = JSON.parse(fileContent)
    let question = fileContent.filter(el => {
      return el.id === questionId
    })[0]
    let questionArr = fileContent.filter(el => {
      return el.id !== questionId
    })

    newAnswer.id = uuidv4()

    question.answers.push(newAnswer)
    questionArr.push(question)
    questionArr = JSON.stringify(questionArr)

    writeFile(fileName, questionArr, err => {
      if (err) {
        console.error(err)
      }

      return 'Question added'
    })

    return `Answer: ${answer} to questionId: ${questionId}`
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
