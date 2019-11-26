const fs = require('fs')
const babelParser = require('@babel/parser')
const babelTraverse = require('@babel/traverse').default
const generate = require('babel-generator').default
const prettier = require('prettier')

/*
 * 在Array中插入元素
 */
function insertElementInList (arrayFilePath, element) {
  const fileContent = fs.readFileSync(arrayFilePath).toString()

  const estree = babelParser.parse(fileContent, {
    sourceType: 'module'
  })
  babelTraverse(estree, {
    enter (path) {
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
  fs.writeFileSync(arrayFilePath, prettier.format(output.code, { semi: false, parser: 'babel' }))
}

/**
 * 在Ojbect中插入属性
 * @param objectFilePath
 * @param element
 */
function addElementInObject (objectFilePath, element) {
  const fileContent = fs.readFileSync(objectFilePath).toString()

  const estree = babelParser.parse(fileContent, {
    sourceType: 'module'
  })
  babelTraverse(estree, {
    enter (path) {
      path.traverse({
        VariableDeclaration (path) {
          path.traverse({
            ObjectExpression (path) {
              path.node.properties.push(element)
            }
          })
        }
      })
    }
  })

  const output = generate(estree, { retainLines: true })
  fs.writeFileSync(objectFilePath, prettier.format(output.code, { semi: false, parser: 'babel' }))
}

module.exports = {
  insertElementInList,
  addElementInObject
}
