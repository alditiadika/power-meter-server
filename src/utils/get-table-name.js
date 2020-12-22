export const getTableName = topic => {
  const isVoltage = topic.includes('Voltage')
  const isCurrent = topic.includes('Current')
  const isPower = topic.includes('Power')
  const isEnergy = topic.includes('Energy')
  if(isVoltage) return 'voltage_data'
  if(isCurrent) return 'current_data'
  if(isPower) return 'power_data'
  if(isEnergy) return 'energy_data'
  return undefined
}