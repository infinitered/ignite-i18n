const test = require('ava')
const sinon = require('sinon')
const plugin = require('../plugin')

test('removes translations if asked', async t => {
  const removeModule = sinon.spy()
  const removePluginComponentExample = sinon.spy()
  const confirm = sinon.stub().returns(true)
  const remove = sinon.spy()
  const replaceInFile = sinon.spy()

  const context = {
    ignite: { removeModule, removePluginComponentExample },
    prompt: { confirm },
    filesystem: { remove },
    patching: { replaceInFile }
  }

  await plugin.remove(context)

  t.true(removeModule.calledWith('react-native-i18n', { unlink: true }))
  t.true(removePluginComponentExample.calledWith('i18nExample.js.ejs'))
  t.true(confirm.called)
  t.is(remove.args[0][0], `${process.cwd()}/App/I18n`)
  t.is(replaceInFile.args[0][0], `${process.cwd()}/App/Config/AppConfig.js`)
  t.is(replaceInFile.args[0][1], `import '../I18n/I18n'\n`)
})

test("doesn't remove translations if use said no", async t => {
  const removeModule = sinon.spy()
  const removePluginComponentExample = sinon.spy()
  const confirm = sinon.stub().returns(false)
  const remove = sinon.spy()
  const replaceInFile = sinon.spy()

  const context = {
    ignite: { removeModule, removePluginComponentExample },
    prompt: { confirm },
    filesystem: { remove },
    patching: { replaceInFile }
  }

  await plugin.remove(context)

  t.true(removeModule.calledWith('react-native-i18n', { unlink: true }))
  t.true(removePluginComponentExample.calledWith('i18nExample.js.ejs'))
  t.true(confirm.called)
  t.false(remove.called)
  t.is(replaceInFile.args[0][0], `${process.cwd()}/App/Config/AppConfig.js`)
  t.is(replaceInFile.args[0][1], `import '../I18n/I18n'\n`)
})
