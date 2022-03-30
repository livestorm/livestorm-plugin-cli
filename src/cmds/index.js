const publish = require('./publish')
const create = require('./create')
const remove = require('./remove')
const review = require('./review')
const watch = require('./watch')
const build = require('./build')
const asset = require('./asset')
const help = require('./help')
const list = require('./list')
const envs = require('./envs')
const { upgrade } = require('./upgrade')
const version = require('./version').printModuleVersion

module.exports = {
  publish,
  create,
  remove,
  review,
  watch,
  build,
  asset,
  help,
  list,
  envs,
  upgrade,
  version
}
