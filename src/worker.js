import moment from 'moment'
import { pool } from './utils/database-connector'
import { mqttConnector, mqttSub } from './utils/mqtt-setup'
import { TOPIC } from './config/config.json'
import { getTableName } from './utils/get-table-name'

const worker = async socket => {
  const { is_connected, client } = await mqttConnector()
  if(is_connected) {
    TOPIC.forEach(async item => {
      const mainPath = 'home/sensors/gateway_1'
      await mqttSub({ client, topic:`${mainPath}/${item}` })
    })
    client.on('message', async (topic, message) => {
      const value = isNaN(parseInt(message.toString())) ? null: message.toString()
      const createdDate = moment().local().format('YYYY-MM-DD HH:mm:ss')
      const messageReturn = { topic, message:value, created_date:createdDate }
      if(value !== null) {
        socket.emit('notification', messageReturn)
        try {
          const [, , sensor] = topic.split('/')
          const client = await pool.connect()
          const tableName = getTableName(topic)
          await client.query(`
          insert into ${tableName} 
            ("sensor", "topic", "value", "created_date") values 
            ('${sensor}', '${topic}', ${value}, '${createdDate}')
            `)
          client.release()
        } catch(e) {
          console.log(e)
        }
      }
    })
  } else console.log('cannot connect to mqtt server')
}
export default worker
