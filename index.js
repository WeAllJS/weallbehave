#!/usr/bin/env node
'use strict'

var fs = require('fs')
var path = require('path')

var yargs = require('yargs')
.usage('Usage: $0 [options]')
.example('$0 > coc.md', 'Output a code of conduct to stdout and pipe to coc.md')
.example('$0 -o .', 'Write `CODE_OF_CONDUCT.md` to current directory (.).')
.example('$0 -o ./coc.md', 'Write `coc.md` to current directory.')
.alias('o', 'output')
.nargs('o', 1)
.normalize('o')
.describe('o', 'Output to directory or make new file.')
.help()

var maintainers = []

try {
  var pkg = require(path.join(process.cwd(), 'package.json'))
  if (pkg.author) {
    maintainers.push(pkg.author)
  }
  if (pkg.contributors) {
    maintainers = maintainers.concat(pkg.contributors)
  }
} catch (e) {}

maintainers = maintainers.map(normalizePerson).filter(function (m) {
  return m['coc-enforcer'] !== false
})

var coc = fs.readFileSync(
  path.join(__dirname, 'CODE_OF_CONDUCT.md'),
  'utf8'
)
var contactStr = '\n### Contacting Maintainers\n\n'
var contactIdx = coc.match(contactStr).index

var furtherStr = '\n### Further Enforcement\n'
var furtherIdx = coc.match(furtherStr).index

var enforcerStr = ''
if (maintainers.length) {
  var haveEmail = maintainers.filter(function (m) { return !!m.email })
  var haveTwitter = maintainers.filter(function (m) { return !!m.twitter })
  if (haveEmail.length || haveTwitter.length) {
    enforcerStr = 'You may get in touch with the maintainer team through any of the following methods:\n'
  }
  if (haveEmail.length) {
    enforcerStr += '\n  * Through email:'
    haveEmail.forEach(function (m) {
      enforcerStr += '\n    * [' + m.email + '](mailto:' + m.email + ')'
      if (m.name) {
        enforcerStr += ' (' + m.name + ')'
      }
    })
    enforcerStr += '\n'
  }
  if (haveTwitter.length) {
    enforcerStr += '\n  * Through Twitter:'
    haveTwitter.forEach(function (m) {
      var handle = '@' + m.twitter.replace(/@/, '').replace(/.*twitter\.com[/]*/, '')
      enforcerStr += '\n    * [' + handle + '](https://twitter.com/' + handle.substr(1) + ')'
      if (m.name) {
        enforcerStr += ' (' + m.name + ')'
      }
    })
    enforcerStr += '\n'
  }
} else {
  console.warn('** Please consider adding an author and/or contributors field to package.json with contact details. See https://npm.im/weallbehave and `npm help package.json` for details **')
  enforcerStr = 'Refer to the GitHub repository for collaborator/maintainer information and email someone there.'
}

var newCoC = (
  coc.substr(0, contactIdx + contactStr.length) +
  enforcerStr +
  coc.substr(furtherIdx)
)

if (!yargs.argv.output) {
  console.log(newCoC)
  process.exit(0)
}

var target = path.resolve(yargs.argv.output)
try {
  if (fs.statSync(target).isDirectory()) {
    target = path.join(target, 'CODE_OF_CONDUCT.md')
  }
} catch (e) {}

fs.writeFileSync(target, newCoC)
console.log('Code of Conduct written to', target)
process.exit(0)

// Taken from normalize-package-data
function normalizePerson (person) {
  if (typeof person !== 'string') return person
  var name = person.match(/^([^(<]+)/)
  var url = person.match(/\(([^)]+)\)/)
  var email = person.match(/<([^>]+)>/)
  var obj = {}
  if (name && name[0].trim()) obj.name = name[0].trim()
  if (email) obj.email = email[1]
  if (url) obj.url = url[1]
  return obj
}
