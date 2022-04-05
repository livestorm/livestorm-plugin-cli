const { Table } = require('console-table-printer')
const chalk = require('chalk')

const table = new Table({
  columns: [
    {
      name: 'command',
      alignment: 'left',
      title: chalk.blue('Command'), 
    },
    {
      name: 'description',
      alignment: 'left',
      title: chalk.blue('Description'), 
    }
  ]
})

module.exports = () => {
  console.log(`
________________    _____________________________________________  ___
___  /____  _/_ |  / /__  ____/_  ___/__  __/_  __ \\__  __ \\__   |/  /
__  /  __  / __ | / /__  __/  _____  \\__ /  _  / / /_  /_/ /_  /|_/ / 
_  /____/ /  __ |/ / _  /___  ____/ /_  /   / /_/ /_  _, _/_  /  / /  
/_____/___/  _____/  /_____/  /____/ /_/    \\____/ /_/ |_| /_/  /_/   
  `)
  console.log(`Welcome to Livestorm Plugins CLI.`)
  console.log('Take your events to the next level with Livestorm plugins, a powerful SDK designed to let you build amazing experiences, on top of a platform you already love.')
  console.log('This CLI allows you to build, publish and manage your Livestorm plugins.')
  console.log('\n')

  table.addRows([
    { command: 'create', description: 'Generate a new plugin' },
    { command: 'publish <environment>', description: 'Publish your plugin' },
    { command: 'watch   <environment>', description: 'Publish your plugin each time you make a change' },
    { command: 'review', description: 'Ask Livestorm a review to publish your plugin to our marketplace or access private APIs' },
    { command: 'remove  <environment>', description: 'Unpublish the plugin' },
    { command: 'asset   <file>', description: 'Upload files and use them in your plugins' },
    { command: 'list [--environment|--api-token]', description: 'List the published plugins' },
    { command: 'envs [add|remove|list] <environment> [--api-token|--endpoint]', description: 'Manage your environments' },
  ])
  table.printTable()

  console.log('')
  console.log(`Check out our getting started guide: https://developers.livestorm.co/docs/getting-started-with-plugins-sdk`)
  console.log('and our offical video course: https://fast.wistia.net/embed/channel/azooxwj070')
  console.log('Love developing plugins? Check out our open positions: https://jobs.livestorm.co/')
  console.log(`\n`)
}