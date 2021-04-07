import { pool } from '../utils/database-connector'

const getExtermeValue = async (_, res) => {
  try {
    const query = 'select id, code, gateway, title, min_value, max_value from config_extreme_value'
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
const updateExtremeValue = async (req, res) => {
  try {
    const { min_value, max_value, id } = req.body
    const query = `update config_extreme_value set (min_value, max_value) = (${min_value}, ${max_value}) where id = ${id}`
    const client = await pool.connect()
    const { rows }  = await client.query(query)
    const dataSend = { status:200, message:rows }
    res.send(dataSend)
    client.release
  } catch(e) {
    console.log(e)
    res.status(500).send({ status:500, message:e.toString() })
  }
}
export default { getExtermeValue, updateExtremeValue }