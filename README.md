# weallbehave [![npm version](https://img.shields.io/npm/v/weallbehave.svg)](https://npm.im/weallbehave) [![license](https://img.shields.io/npm/l/weallbehave.svg)](https://npm.im/weallbehave) [![Travis](https://img.shields.io/travis/wealljs/weallbehave.svg)](https://travis-ci.org/wealljs/weallbehave) [![AppVeyor](https://ci.appveyor.com/api/projects/status/github/wealljs/weallbehave?svg=true)](https://ci.appveyor.com/project/wealljs/weallbehave) [![Coverage Status](https://coveralls.io/repos/github/wealljs/weallbehave/badge.svg?branch=latest)](https://coveralls.io/github/wealljs/weallbehave?branch=latest)

[`weallbehave`](https://npm.im/weallbehave) is a command-line tool for automatically generating and updating the [`CODE_OF_CONDUCT.md`](https://help.github.com/articles/adding-a-code-of-conduct-to-your-project/) for your projects.

You can configure the maintainers that will enforce the CoC by adding `author` and `contributors` fields to `package.json`. Currently `email` and `twitter` are supported. You can exclude maintainers from enforcement duties by adding `"coc-enforcer": false` to their author/contributors entry.

## Install

#### Locally to your npm project (recommended):

`$ npm install --save-dev weallbehave`

#### Globally:

`$ npm install -g weallbehave`

## Example

### npm repo
```javascript
// package.json
{
  "scripts": {
    "update-coc": "weallbehave -o . && git add CODE_OF_CONDUCT.md && git commit -m 'docs(coc): updated CODE_OF_CONDUCT.md'"
  },
  "author": {
    "name": "Alice",
    "email": "pwnu@sekrit.hax",
    "twitter": "@socialistengineering"
  },
  "contributors": [
    {
      "name": "Bob",
      "email": "me@friendly.bob",
      "coc-enforcer": false
    },
    {
      "name": "Catherine",
      "email": "this@kitty.slays"
    }
  ]
}
// Now you can do `npm run update-coc` any time you
// bump your `weallbehave` version to bring your docs
// up to date! And you don't need a global install!
```

### Global CLI install
```sh
# Read your repo info from package.json or git
# and pipe the output to `coc.md`
$ weallbehave > coc.md

# Write a CODE_OF_CONDUCT.md document to the ./foo dir.
$ weallbehave -o ./foo
```
