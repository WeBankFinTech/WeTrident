var express = require('express')
var router = express.Router()

/* GET analysis page. */
router.get('/', function (req, res, next) {
  const fileName = ((req.query && req.query.file) || '').replace(new RegExp('.+/', 'g'), '')
  const title = `[${fileName.replace('.txt', '')}] Traversal Results`
  let traversingRecords
  let finishedRecords
  if (fileName) {
    loadRecords(fileName).then(
      result => {
        if (result) {
          traversingRecords = parseTraversingRecords(result.traversingRecords)
          finishedRecords = parseFinishedRecords(result.finishedRecords)
          res.render('analysis', {
            title,
            error: '',
            traversingRecords,
            finishedRecords
          })
        } else {
          res.render('analysis', {
            title,
            error: 'Traversal records can not be found. Check it over please.'
          })
        }
      },
      () => {
        res.render('analysis', {
          title,
          error: 'Encounter some errors! Try it again later please.'
        })
      }
    )
  } else {
    res.render('analysis', {
      title,
      error: 'File name of traversal records is empty! Check it over please.'
    })
  }
})

function parseTraversingRecords (sourceData) {
  let targetData
  for (let index = 0; index < sourceData.length; index++) {
    if (sourceData[index].trim().startWith('\\[traversal\\]')) {
      const record = sourceData[index].trim().replace('[traversal]', '').split('_')

      if (!targetData) {
        targetData = {}
      }

      if (record.length !== 3) {
        continue
      }

      if (!targetData[record[0]]) {
        targetData[record[0]] = {}
      }
      if (!targetData[record[0]][record[1]]) {
        targetData[record[0]][record[1]] = {}
      }
      if (!targetData[record[0]][record[1]][record[2]]) {
        targetData[record[0]][record[1]][record[2]] = []
      }
    } else if (sourceData[index].trim().startWith('\\[error\\]') && index > 0 && sourceData[index - 1].trim().startWith('\\[traversal\\]')) {
      const tRecord = sourceData[index - 1].trim().replace('[traversal]', '').split('_')
      const eRecord = sourceData[index].trim().replace('[error]', '').split('_')

      if (!targetData) {
        targetData = {}
      }

      if (tRecord[0] !== eRecord[0] || tRecord[1] !== eRecord[1]) {
        continue
      }

      if (!targetData[tRecord[0]]) {
        targetData[tRecord[0]] = {}
      }
      if (!targetData[tRecord[0]][tRecord[1]]) {
        targetData[tRecord[0]][tRecord[1]] = {}
      }
      if (!targetData[tRecord[0]][tRecord[1]][tRecord[2]]) {
        targetData[tRecord[0]][tRecord[1]][tRecord[2]] = []
      }

      targetData[tRecord[0]][tRecord[1]][tRecord[2]].push(eRecord[2])
    }
  }
  return targetData
}

function parseFinishedRecords (sourceData) {
  let targetData
  for (let index = 0; index < sourceData.length; index++) {
    const record = sourceData[index].trim().replace('[finished]', '').split('_')
    if (!targetData) {
      targetData = {}
    }
    if (record.length !== 2) {
      continue
    }
    if (!targetData[record[0]]) {
      targetData[record[0]] = {}
    }
    targetData[record[0]][record[1]] = true
  }
  return targetData
}

function loadRecords (fileName) {
  const fs = require('fs')
  return new Promise((resolve, reject) => {
    fs.access(getFilePath(fileName), fileNotExsitsError => {
      if (!fileNotExsitsError) {
        fs.readFile(getFilePath(fileName), (readFileError, data) => {
          if (readFileError) {
            console.log(readFileError)
            reject(readFileError)
          } else {
            const traversingRecords = data.toString().trim().split('\n').filter(item => !!item && (item.trim().startWith('\\[traversal\\]') || item.trim().startWith('\\[error\\]')))
            const finishedRecords = data.toString().trim().split('\n').filter(item => !!item && item.trim().startWith('\\[finished\\]'))
            resolve({
              traversingRecords,
              finishedRecords
            })
          }
        })
      } else {
        resolve()
      }
    })
  })
}

function getRecordsRootDir () {
  return '../records/'
}

function getFilePath (fileName) {
  return getRecordsRootDir() + fileName
}

module.exports = router
