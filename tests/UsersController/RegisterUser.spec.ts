import User from 'App/Models/User'
import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('User Creation Flow', () => {
  test('it should be able to register a new professional', async () => {
    await supertest(BASE_URL)
      .post('/users')
      .send({
        name: 'Ophelia Greene',
        email: 'opheliagreene@gmail.com',
        phone: '11123456789',
        birth_date: '2001/02/21',
        password: '27465',
        gender: 'masculino',
        occupation: 'Tester',
        professional_id: null,
        place: 'Any Street, 01',
        district: 'Any district',
        uf: 'SP',
        city: 'Any City',
      })
      .expect(201, {
        status: 'success',
        message: 'Created!',
      })
  })

  test('it should be able to register a new patient', async () => {
    const professional_id = await User.first()

    await supertest(BASE_URL)
      .post('/users')
      .send({
        name: 'Joshua Gilbert',
        email: 'joshuagilbert@gmail.com',
        phone: '11123456789',
        birth_date: '2001/02/21',
        password: '27465',
        gender: 'masculino',
        occupation: 'Tester',
        professional_id: professional_id?.id,
        place: 'Any Street, 01',
        district: 'Any district',
        uf: 'SP',
        city: 'Any City',
      })
      .expect(201, {
        status: 'success',
        message: 'Created!',
      })
  })

  test('it should be able to register a user with exists email', async () => {
    await supertest(BASE_URL)
      .post('/users')
      .send({
        name: 'Ophelia Greene',
        email: 'opheliagreene@gmail.com',
        phone: '11123456789',
        birth_date: '2001/02/21',
        password: '27465',
        gender: 'masculino',
        occupation: 'Tester',
        professional_id: null,
        place: 'Any Street, 01',
        district: 'Any district',
        uf: 'SP',
        city: 'Any City',
      })
      .expect(400, {
        status: 'error',
        message: 'User already exists!',
      })
  })

  test('it should be able to register a user with invalid data', async () => {
    await supertest(BASE_URL)
      .post('/users')
      .send({
        name: 'Ophelia Greene',
        phone: '11123456789',
        birth_date: '12/02/2002',
        password: '27465',
        gender: 'Masculino',
        occupation: 'Tester',
        professional_id: null,
        place: 'Any Street, 01',
        district: 'Any district',
        uf: 'SP',
        city: 'Any City',
      })
      .expect(422, {
        errors: [
          {
            field: 'email',
            message: 'required validation failed',
            rule: 'required',
          },
          {
            field: 'birth_date',
            message: 'regex validation failed',
            rule: 'regex',
          },
          {
            args: {
              choices: ['masculino', 'feminino'],
            },
            field: 'gender',
            message: 'enum validation failed',
            rule: 'enum',
          },
        ],
      })
  })
})
