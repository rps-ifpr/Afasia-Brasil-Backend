import test from 'japa'
import supertest from 'supertest'
import User from 'App/Models/User'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Patients Listing Flow', async () => {
  test('it should be able to list the patients of the logged in user', async () => {
    const response = await supertest(BASE_URL).post('/sessions').send({
      email: 'opheliagreene@gmail.com',
      password: '27465',
    })

    const patients = await User.query()
      .where('occupation', 'Paciente')
      .andWhere('professional_id', response.body.user.id)
      .preload('address')
      .orderBy('created_at', 'desc')

    await supertest(BASE_URL)
      .get('/users/patients')
      .set({ Authorization: `Bearer ${response.body.token.token}` })
      .expect(200, patients)
  })
})
