
require('@babel/register')({
  presets: ['@babel/preset-env'],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread', 
    '@babel/plugin-transform-async-to-generator', 
    '@babel/plugin-transform-regenerator'
  ]
})
    
module.exports = require('./src/index.js')