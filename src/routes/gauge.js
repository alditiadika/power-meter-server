import { pool } from '../utils/database-connector'

const fields = '"value"'

const gaugeRouter = async (req, res) => {
  const sensor = req.query.sensor
  const topic = {
    voltage:`home/sensors/${sensor}/Voltage_LN_Avg`,
    current:`home/sensors/${sensor}/Current_Avg`,
    power:`home/sensors/${sensor}/Active_Power_Total`,
    power_factor:`home/sensors/${sensor}/Power_Factor_Total`,
    energy:`home/sensors/${sensor}/ActiveEnergyDelivered`
  }
  if(!checkInvalidParameter(sensor)) {
    const client = await pool.connect()
    const queryVoltage = `
      select ${fields} 
      from v_voltage_data md 
      where "topic" = '${topic.voltage}' and sensor = '${sensor}' order by "minute_created" desc limit 1
    `
    const queryCurrent = `
      select ${fields} 
      from v_current_data md 
      where "topic" = '${topic.current}' and sensor = '${sensor}' order by "minute_created" desc limit 1
    `
    const queryPower = `
      select ${fields} 
      from v_power_data md 
      where "topic" = '${topic.power}' and sensor = '${sensor}' order by "minute_created" desc limit 1
    `
    const queryPowerFactor = `
      select ${fields} 
      from v_power_data md 
      where "topic" = '${topic.power}' and sensor = '${sensor}' order by "minute_created" desc limit 1
    `
    const queryEnergy = `
      select ${fields} 
      from v_energy_data md 
      where "topic" = '${topic.energy}' and sensor = '${sensor}' order by "minute_created" desc limit 1
    `
    const [voltageData] = (await client.query(queryVoltage)).rows
    const [currentData] = (await client.query(queryCurrent)).rows
    const [powerData] = (await client.query(queryPower)).rows
    const [powerFactorData] = (await client.query(queryPowerFactor)).rows
    const [energyData] = (await client.query(queryEnergy)).rows
    
    const message = {
      voltage:voltageData ? voltageData.value: null,
      current:currentData ? currentData.value: null,
      power:powerData ? powerData.value: null,
      power_factor:powerFactorData ? powerFactorData.value: null,
      energy: energyData ? energyData.value:null
    }
    const dataSend = { status:200, message }
    res.send(dataSend)
    client.release()
  } else {
    res.send({ status:500, message:'invalid sensor' })
  }
}
export default gaugeRouter
const checkInvalidParameter = param => {
  if(param === '' || param === undefined || param === null || param === 'null' || param === 'undefined') return true
  return false
}