import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'CategoriesCategorizeController.index')

  Route.post('/', 'CategoriesCategorizeController.create').middleware('auth')

  Route.put(
    '/:category_id',
    'CategoriesCategorizeController.update'
  ).middleware('auth')

  Route.delete(
    '/:category_id',
    'CategoriesCategorizeController.destroy'
  ).middleware('auth')
}).prefix('/categories')
