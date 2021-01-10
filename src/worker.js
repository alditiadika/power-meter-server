import moment from 'moment'
import { pool } from './utils/database-connector'
import { mqttConnector, mqttSub } from './utils/mqtt-setup'
import { TOPIC } from './config/config.json'
import { getTableName } from './utils/get-table-name'

const worker = async socket => {
  const { is_connected, client } = await mqttConnector()
  if(is_connected) {
    const topics = listTopic()
    topics.forEach(async item => {
      await mqttSub({ client, topic:`${item}` })
    })
    client.on('message', async (topic, message) => {
      const value = isNaN(parseInt(message.toString())) ? null: message.toString()
      const createdDate = moment().format()
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
const listTopic = () => {
  let arr = []
  const gateways = new Array(16).fill(0).map((_, index) => `gateway_${index + 1}`)
  gateways.forEach(gateway => {
    TOPIC.forEach(item => {
      const path = `home/sensors/${gateway}/${item}`
      arr.push(path)
    })
  })
  return arr
}