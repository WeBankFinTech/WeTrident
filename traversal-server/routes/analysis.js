var express = require('express');
var router = express.Router();

/* GET analysis page. */
router.get('/', function(req, res, next) {
	let fileName = req.query && req.query.file || ''
	let title = `[${fileName.replace('.txt', '')}] Traversal Results`
	let traversingRecords
	let finishedRecords
	let errorRecords
	if (fileName) {
		loadRecords(fileName).then(
			result => {
				if (result) {
					traversingRecords = parseTraversingRecords(result.traversingRecords)
					finishedRecords = parseFinishedRecords(result.finishedRecords)
					errorRecords = parseErrors(result.errors)
					res.render('analysis', {
						title,
						traversingRecords,
						finishedRecords,
						errorRecords
					})
				} else {
					res.render('analysis', {
						title,
						error: 'Traversal records can not be found. Check it over please.'
					})
				}
			},
			error => {
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
});

function parseTraversingRecords(sourceData) {
	let targetData
	for (let index = 0; index < sourceData.length; index++) {
		let record = sourceData[index].trim().replace('[traversal]', '').split('_')
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
			targetData[record[0]][record[1]] = []
		}
		targetData[record[0]][record[1]].push(record[2])
	}
	return targetData
}

function parseFinishedRecords(sourceData) {
	let targetData
	for (let index = 0; index < sourceData.length; index++) {
		let record = sourceData[index].trim().replace('[finished]', '').split('_')
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

function parseErrors(sourceData) {
	let targetData
	for (let index = 0; index < sourceData.length; index++) {
		let record = sourceData[index].trim().replace('[error]', '').split('_')
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
			targetData[record[0]][record[1]] = []
		}
		targetData[record[0]][record[1]].push(record[2])
	}
	return targetData
}

function loadRecords(fileName) {
	let fs = require('fs')
	return new Promise((resolve, reject) => {
		fs.exists(getFilePath(fileName), exists => {
			if (exists) {
				fs.readFile(getFilePath(fileName), (error, data) => {
					if (error) {
						console.log(error)
						reject()
					} else {
						let traversingRecords = data.toString().trim().split('\n').filter(item => !!item && item.trim().startWith('\\[traversal\\]'))
						let finishedRecords = data.toString().trim().split('\n').filter(item => !!item && item.trim().startWith('\\[finished\\]'))
						let errors = data.toString().trim().split('\n').filter(item => !!item && item.trim().startWith('\\[error\\]'))
						resolve({
							traversingRecords,
							finishedRecords,
							errors
						})
					}
				})
			} else {
				resolve()
			}
		})
	})
}

function getRecordsRootDir() {
	return '../records/'
}

function getFilePath(fileName) {
	return getRecordsRootDir() + fileName
}

module.exports = router;
