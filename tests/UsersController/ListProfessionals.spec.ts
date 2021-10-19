import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('User Listing Flow', async () => {
  test('it should be able to list all professionals', async () => {
    await supertest(BASE_URL).get('/users').expect(200)
  })
})
