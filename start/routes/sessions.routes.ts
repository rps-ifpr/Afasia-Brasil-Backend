import Route from '@ioc:Adonis/Core/Route'

Route.post('/sessions', 'SessionsController.create')

Route.delete('/sessions', 'SessionsController.destroy')
