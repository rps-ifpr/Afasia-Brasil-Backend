import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('User Authentication Flow', () => {
  test('it should be able to authentication a user', async () => {
    await supertest(BASE_URL)
      .post('/sessions')
      .send({
        email: 'opheliagreene@gmail.com',
        password: '27465',
      })
      .expect(200)
  })

  test('it should not be able to authenticate non-existent user', async () => {
    await supertest(BASE_URL)
      .post('/sessions')
      .send({
        email: 'jagin@vawhuzba.sh',
        password: '27465',
      })
      .expect(400, {
        status: 'error',
        message: 'Email/password is incorrect!',
      })
  })

  test('it should not be able to authenticate a user with incorrect password', async () => {
    await supertest(BASE_URL)
      .post('/sessions')
      .send({
        email: 'opheliagreene@gmail.com',
        password: 'incorrect-password',
      })
      .expect(400, {
        status: 'error',
        message: 'Email/password is incorrect!',
      })
  })

  test('it should not be able to authenticate a user with invalid data', async () => {
    await supertest(BASE_URL)
      .post('/sessions')
      .send({})
      .expect(422, {
        errors: [
          {
            rule: 'required',
            field: 'email',
            message: 'required validation failed',
          },
          {
            rule: 'required',
            field: 'password',
            message: 'required validation failed',
          },
        ],
      })
  })
})
