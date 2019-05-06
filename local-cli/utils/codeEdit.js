function insertElementInList (arrayFilePath, element) {
  const fs = require('fs')
  const babelParser = require('@babel/parser')
  const babelTraverse = require('@babel/traverse').default
  const generate = require('babel-generator').default

  console.log(arrayFilePath)
  const fileContent = fs.readFileSync(arrayFilePath).toString()

  const estree = babelParser.parse(fileContent, {
    sourceType: 'module'
  })
  babelTraverse(estree, {
    enter (path) {
      // console.log(path.node.type)
      if (path.node.type === 'ExportDefaultDeclaration') {
        path.traverse({
          ArrayExpression (path) {
            path.node.elements.push(element)
          }
        })
      }
    }
  })

  const output = generate(estree, { retainLines: true })
  fs.writeFileSync(arrayFilePath, output.code)
}

module.exports = {
  insertElementInList
}
