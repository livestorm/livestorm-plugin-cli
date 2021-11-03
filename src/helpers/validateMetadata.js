
function validateMetadata(json) {
  try {
    if (!json) throw 'Your environment is missing the "metadata" property.'
    if (!json.logo) throw 'No logo provided in the "metadata" property.'

    if (!json.translations) throw 'Your "metadata" must include a translations object to display your plugin in the marketplace.'
    if (!json.translations.title) throw 'You must provide a title in the translations object.'
    if (!json.translations.title.en) throw 'Your title does not contain english translations.'

    if (!json.translations.description) throw 'You must provide a translated description in the translations object.'
    if (!json.translations.description.en) throw 'Your description does not contain english translations.'
  } catch(err) {
    console.log(err)
    console.log('Make sure your environment\'s "metadata" property follows the correct pattern: https://developers.livestorm.co/docs/review-marketplace#submit-your-plugin-to-the-marketplace')
    process.exit(1)
  }
}

module.exports = validateMetadata