const NPM_MODULE_NAME = 'react-native-i18n'
const NPM_MODULE_VERSION = '2.0.14' // update in `add.test.js` too
const EXAMPLE_FILE = 'i18nExample.js.ejs'

const add = async function(context) {
  const { ignite, filesystem } = context

  // install a npm module
  await ignite.addModule(NPM_MODULE_NAME, {
    version: NPM_MODULE_VERSION,
    link: true
  })

  // copy the example file (if examples are turned on)
  await ignite.addPluginComponentExample(EXAMPLE_FILE, {
    title: 'i18n Example'
  })

  // Copy templates/I18n to App/I18n if it doesn't already exist
  if (!filesystem.exists(`${process.cwd()}/App/I18n`)) {
    filesystem.copy(`${__dirname}/templates/I18n`, `${process.cwd()}/App/I18n`)
  }

  // Patch the I18n file in
  ignite.patchInFile(`${process.cwd()}/App/Config/AppConfig.js`, {
    insert: `import '../I18n/I18n'\n`,
    before: `export default {`
  })
}

/**
 * Remove yourself from the project.
 */
const remove = async function(context) {
  const { ignite, filesystem, patching } = context

  // remove the npm module
  await ignite.removeModule(NPM_MODULE_NAME, { unlink: true })

  // remove the component example
  await ignite.removePluginComponentExample(EXAMPLE_FILE)

  // Remove App/I18n folder
  const removeI18n = await context.prompt.confirm(
    'Do you want to remove all of your translation files in App/I18n?'
  )
  if (removeI18n) {
    filesystem.remove(`${process.cwd()}/App/I18n`)
  }

  // Remove i18n from AppConfig
  patching.replaceInFile(
    `${process.cwd()}/App/Config/AppConfig.js`,
    `import '../I18n/I18n'\n`,
    ''
  )
}

module.exports = { add, remove }
