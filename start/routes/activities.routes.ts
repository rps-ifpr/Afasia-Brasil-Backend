import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.post('/', 'CategorizeActivitiesController.create').middleware('auth')

    Route.get('/', 'CategorizeActivitiesController.index')

    Route.get('/details', 'CategorizeActivitiesController.show')

    Route.delete(
      '/:activity_id',
      'CategorizeActivitiesController.destroy'
    ).middleware('auth')
  }).prefix('/categorize')

  Route.group(() => {
    Route.post('/', 'RelateActivitiesController.create').middleware('auth')

    Route.get('/', 'RelateActivitiesController.index')

    Route.get('/details', 'RelateActivitiesController.show')

    Route.put('/:activity_id', 'RelateActivitiesController.update').middleware(
      'auth'
    )

    Route.delete(
      '/:activity_id',
      'RelateActivitiesController.destroy'
    ).middleware('auth')
  }).prefix('/relate')

  Route.group(() => {
    Route.post('/', 'SynonymActivitiesController.create').middleware('auth')

    Route.get('/', 'SynonymActivitiesController.index')

    Route.get('/details', 'SynonymActivitiesController.show')

    Route.put('/:activity_id', 'SynonymActivitiesController.update').middleware(
      'auth'
    )

    Route.delete(
      '/:activity_id',
      'SynonymActivitiesController.destroy'
    ).middleware('auth')
  }).prefix('/synonym')

  Route.group(() => {
    Route.post('/', 'AntonymActivitiesController.create').middleware('auth')
    Route.post('/items', 'AntonymItemsController.create').middleware('auth')

    Route.get('/', 'AntonymActivitiesController.index')

    Route.get('/details', 'AntonymActivitiesController.show')

    Route.delete('/', 'AntonymActivitiesController.destroy').middleware('auth')
  }).prefix('/antonym')

  Route.group(() => {
    Route.post('/', 'ComplementActivitiesController.create').middleware('auth')

    Route.get('/', 'ComplementActivitiesController.index')

    Route.get('/details', 'ComplementActivitiesController.show')

    Route.delete('/', 'ComplementActivitiesController.destroy').middleware(
      'auth'
    )
  }).prefix('/complement')
}).prefix('/activities')
