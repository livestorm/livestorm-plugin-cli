const path = require('path')
const fs = require('fs')
const { default: fetch } = require('node-fetch')

module.exports = function asset() {
  let file = process.argv[3]
  if (!file) {
    console.log('Please specify the asset to upload')
    console.log('Usage: livestorm asset <file>')
    process.exit(1)
  }
  file = path.join(process.cwd(), file)

  if (fs.statSync(file).size / (1024*1024) > 8) {
    console.log('File size must be inferior to 8MB.')
    process.exit(1)
  }
  

  const data = {
    base64: fs.readFileSync(file, {encoding: 'base64'}),
    extension: path.extname(file),
    filename: path.parse(file).name,
  }


  console.log('Uploading...')
  fetch(
    'https://plugins.livestorm.co/api/v1/medias',
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'Application/JSON'
      }
    }
  )
    .then((res) => {
      if (res.status === 201) return res.json()
      else throw new Error('Incorrect response, verify integrity and size.')
    })
    .then((response) => {
      console.log(`Done ! Your file is available at ${response.url}`)
    })
    .catch((error) => console.error(error));
}