import mqtt from 'mqtt'
import { MQTT_SERVER } from '../config/config.json'
const { host, port, username, password } = MQTT_SERVER

const mqttConnector = () => {
  return new Promise((resolve, reject) => {
    const config = { port }
    if(username !== '' && password !== '') {
      config.username = username,
      config.password = password
    }
    const client = mqtt.connect(host, config)
    client.on('connect', () => {
      console.log('mqtt connected...')
      resolve({ is_connected:true, client })
    })

    client.on('error', () => {
      console.log('mqtt error...')
      reject({ is_connected:false, client:null })
    })
  })
}
const mqttSub = ({ client, topic }) => {
  return new Promise((resolve, reject) => {
    client.subscribe(topic, err => {
      if(!err) {
        resolve({ is_error:false })
      } else {
        console.log('error subscribing topic...')
        console.log(topic, err)
        reject({ is_error:true, err })
      }
    })
  })
}
const mqttPub = ({ client, topic, message }) => {
  client.publish(topic, message.toString())
}

export { mqttConnector, mqttSub, mqttPub }