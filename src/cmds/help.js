const cliff = require('cliff')

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
  console.log(
    cliff.stringifyRows([
      ['command','description'],
      ['create', 'Generate a new plugin'],
      ['publish <environment>', 'Publish your plugin'],
      ['watch   <environment>', 'Publish your plugin each time you make a change'],
      ['review', 'Ask Livestorm a review to publish your plugin to our marketplace or access private APIs'],
      ['remove  <environment>', 'Unpublish the plugin'],
      ['asset   <file>', 'Upload files and use them in your plugins'],
      ['list [--environment|--api-token]', 'List the published plugins'],
      ['envs [add|remove|list] <environment> [--api-token|--endpoint]', 'Manage your environments'],
      ['upgrade', 'Upgrade Livestorm Plugins CLI'],
    ], ['blue', 'blue'])
  )

  console.log(`\n`)
  console.log(`Check out our getting started guide: https://developers.livestorm.co/docs/getting-started-with-plugins-sdk`)
  console.log('and our offical video course: https://fast.wistia.net/embed/channel/azooxwj070')
  console.log('Love developing plugins? Check out our open positions: https://jobs.livestorm.co/')
  console.log(`\n`)
}