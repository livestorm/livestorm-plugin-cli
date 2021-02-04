const imgbbUploader = require('imgbb-uploader');

module.exports = function asset() {
  const file = process.argv[3]
  if (!file) {
    console.log('Please specify the asset to upload')
    console.log('Usage: livestorm asset <file>')
    process.exit(1)
  }


  console.log('Uploading...')
  imgbbUploader(
    process.env.IMGBB_KEY,
    `${process.cwd()}/src/assets/${file}`,
  )
    .then((response) => {
      console.log(`Done ! Your file is available at ${response.url}`)
    })
    .catch((error) => console.error(error));
}