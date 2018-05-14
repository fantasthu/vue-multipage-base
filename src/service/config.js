const envSwitch = 1

const env = envSwitch ? 'production' : 'develop'
let config = null
if (env === 'production') {
  config = {
    serverUrl: 'https://velo.top'
  }
} else if (env === 'develop') {
  config = {
    serverUrl: 'http://192.168.1.44:9000'
  }
}
export default config
