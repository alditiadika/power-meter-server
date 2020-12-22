import rootRouter from './root'

const setRouters = app => {
  app.get('/', rootRouter)
}
export default setRouters