import moment from 'moment'
import { pool } from '../utils/database-connector'


const getGateway = async (_, res) => {
  try {
    const query = 'select id, name, code from config_gateway'
    const client = await pool.connect()
    const { rows } = await client.query(query)
    const dataSend = { status:200, message:rows }
    res.send(dataSend)
    client.release()
  } catch(e) {
    console.log(e)
    res.status(500).send({ status:500, message:e.toString() })
  }
}
const updateGateway = async (req, res) => {
  const { gateway_name, gateway_id } = req.body
  try {
    const query = `update config_gateway set ("name", modified_date) = ('${gateway_name}', '${moment().format('YYYY-MM-DD HH:mm:ss')}') where id = ${gateway_id}`
    const client = await pool.connect()
    await client.query(query)
    res.send({ status:200 })
    client.release()
  } catch(e) {
    console.log(e)
    res.status(500).send({ status:500, message:e.toString() })
  }

}
export default { getGateway, updateGateway }