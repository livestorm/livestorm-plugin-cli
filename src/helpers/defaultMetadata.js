
module.exports = function defaultMetadata(answers) {
  return {
    logo: "https://uploads-ssl.webflow.com/60ad0f9314e628baa6971a76/60ec0b72f45280483f7957cf_Icon-Livestorm-Primary.svg",
    translations: {
      title: {
        en: answers.name.charAt(0).toUpperCase() + answers.name.slice(1)
      },
      description: {
       en: "This is your plugin description, you can change it by editing the metadata of your plugin's environment."
      }
    }
  }
}