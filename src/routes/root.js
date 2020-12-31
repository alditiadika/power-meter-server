import moment from 'moment'
import { pool } from '../utils/database-connector'
import { getTableName } from '../utils/get-table-name'

const fields = '"id", "sensor", "topic", "value", "created_date"'

const rootRouter = async (req, res) => {
  const topic = req.query.topic
  const sensor = req.query.sensor
  const exactTopic = `home/sensors/${sensor}/${topic}`
  if(!checkInvalidParameter(topic) && !checkInvalidParameter(sensor)) {
    const client = await pool.connect()
    const tableName = getTableName(topic)
    const lastSeenTime = moment().local().add(-23, 'hour').format('YYYY-MM-DD HH:mm:ss')
    if(tableName) {
      const query = `
        select 
        distinct on (minute_created) minute_created, ${fields} 
        from v_${tableName} md 
        where "topic" = '${exactTopic}' and sensor = '${sensor}' and created_date >= '${lastSeenTime}' order by "minute_created" desc limit 100
      `
      const { rows } = await client.query(query)
      const message = rows.sort((a, b) => moment(a.minute_created) < moment(b.minute_created) ? -1: 1)
      const dataSend = { status:200, message }
      res.send(dataSend)
    } else {
      res.send({ status:500, message:'invalid topic' })
    }
    client.release()
  } else {
    res.send({ status:500, message:'invalid topic or sensor' })
  }
}
export default rootRouter
const checkInvalidParameter = param => {
  if(param === '' || param === undefined || param === null || param === 'null' || param === 'undefined') return true
  return false
}