import rootRouter from './root'
import gaugeRouter from './gauge'

const setRouters = app => {
  app.get('/', rootRouter)
  app.get('/gauge', gaugeRouter)
}
export default setRouters