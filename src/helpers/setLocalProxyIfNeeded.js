module.exports = function setLocalProxyIfNeeded(config) {
  if (config.endpoint.includes('plugins.livestorm.local')) {
    return 'http://localhost:4004'
  } else {
    return config.endpoint
  }
}
