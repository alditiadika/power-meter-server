import rootRouter from './root'
import gaugeRouter from './gauge'
import extremeValue from './extreme-value'
import gatewayConfig from './gateway'

const setRouters = app => {
  app.get('/', rootRouter)
  app.get('/gauge', gaugeRouter)
  app.get('/extreme-value', extremeValue.getExtermeValue)
  app.post('/extreme-value', extremeValue.updateExtremeValue)
  app.get('/gateway-config', gatewayConfig.getGateway)
  app.post('/gateway-config', gatewayConfig.updateGateway)
}
export default setRouters