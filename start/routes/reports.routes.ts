import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'ReportsController.index').middleware('auth')
}).prefix('/reports')
