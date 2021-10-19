import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/', 'ResultsController.create').middleware('auth')

  Route.get('/', 'ResultsController.show').middleware('auth')
}).prefix('/results')
