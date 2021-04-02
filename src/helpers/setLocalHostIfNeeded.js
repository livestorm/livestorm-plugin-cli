module.exports = function setLocalHostIfNeeded(config) {
  if (config.endpoint.includes('plugins.livestorm.local')) {
    return { 'Host': 'plugins.livestorm.local' }
  } else {
    return {}
  }
}
