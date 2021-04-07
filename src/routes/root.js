import moment from 'moment'
import { pool } from '../utils/database-connector'
import { getTableName } from '../utils/get-table-name'

const fields = '"id", "sensor", "topic", "value", "created_date"'

const rootRouter = async (req, res) => {
  const topic = req.query.topic
  const sensor = req.query.sensor
  const exactTopic = `home/sensors/${sensor}/${topic}`
  if(!checkInvalidParameter(topic) && !checkInvalidParameter(sensor)) {
    try {
      const client = await pool.connect()
      const tableName = getTableName(topic)
      
      if(tableName) {
        const query = `
          select 
          distinct on (minute_created) minute_created, ${fields} 
          from v_${tableName} md 
          where "topic" = '${exactTopic}' and sensor = '${sensor}' and created_date >= '${moment().format('YYYY-MM-DD')}' order by "minute_created" desc
        `
        const { rows } = await client.query(query)
        const message = rows.sort((a, b) => moment(a.minute_created) < moment(b.minute_created) ? -1: 1)
        const dataSend = { status:200, message }
        res.send(dataSend)
      } else {
        res.status(404).send({ status:404, message:'invalid topic' })
      }
      client.release()
    } catch(e) {
      console.log(e)
      res.status(500).send({ status:500, message:e.toString() })
    }
  } else {
    res.status(404).send({ status:404, message:'invalid topic or sensor' })
  }
}
export default rootRouter
const checkInvalidParameter = param => {
  if(param === '' || param === undefined || param === null || param === 'null' || param === 'undefined') return true
  return false
}