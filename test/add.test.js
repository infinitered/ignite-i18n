const test = require('ava')
const sinon = require('sinon')
const plugin = require('../plugin')

const NPM_MODULE_VERSION = '2.0.14' // update in plugin.js too

test('copies templates when they do not exist', async t => {
  // spy on few things so we know they're called
  const addModule = sinon.spy()
  const addPluginComponentExample = sinon.spy()
  const exists = sinon.stub().returns(false)
  const copy = sinon.spy()
  const patchInFile = sinon.spy()

  // mock a context
  const context = {
    ignite: { addModule, addPluginComponentExample, patchInFile },
    filesystem: { exists, copy }
  }

  await plugin.add(context)
  t.true(
    addModule.calledWith('react-native-i18n', {
      version: NPM_MODULE_VERSION,
      link: true
    })
  )
  t.true(
    addPluginComponentExample.calledWith('i18nExample.js.ejs', {
      title: 'i18n Example'
    })
  )
  t.true(exists.called)
  t.true(copy.called)
  t.true(patchInFile.called)
})

test('does not clobber existing templates', async t => {
  // spy on few things so we know they're called
  const addModule = sinon.spy()
  const addPluginComponentExample = sinon.spy()
  const exists = sinon.stub().returns(true)
  const copy = sinon.spy()
  const patchInFile = sinon.spy()

  // mock a context
  const context = {
    ignite: { addModule, addPluginComponentExample, patchInFile },
    filesystem: { exists, copy }
  }

  await plugin.add(context)
  t.true(
    addModule.calledWith('react-native-i18n', {
      version: NPM_MODULE_VERSION,
      link: true
    })
  )
  t.true(
    addPluginComponentExample.calledWith('i18nExample.js.ejs', {
      title: 'i18n Example'
    })
  )
  t.true(exists.called)
  t.false(copy.called)
  t.true(patchInFile.called)
})
