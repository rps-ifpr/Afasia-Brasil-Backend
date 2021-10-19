import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/', 'CommunicationItemsController.create').middleware('auth')

  Route.get('/iwant', 'CommunicationItemsController.index')

  Route.get('/yesorno', 'CommunicationItemsController.show')

  Route.delete('/:item_id', 'CommunicationItemsController.destroy').middleware(
    'auth'
  )
}).prefix('/communication')
