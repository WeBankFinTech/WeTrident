const http = require('http')
http.createServer(function (req, res) {
  res.json = (jsonObj) => {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(jsonObj))
  }

  console.log('request handled!!!!!')
  switch (req.url) {
    case '/v1/bookList': {
      res.json([{
        'title': '算法导论',
        'author': '[美] Thomas H.Cormen / Charles E.Leiserson / Ronald L.Rivest / Clifford Stein',
        'ISBN': '9787111187776'
      }, {
        'title': '代码大全',
        'author': '[美] 史蒂夫·迈克康奈尔',
        'ISBN': '9787121022982'
      }])
      break
    }
    case '/v1/bookList2': {
      res.json([{
        'title': '代码大全',
        'author': '[美] 史蒂夫·迈克康奈尔',
        'ISBN': '9787121022982'
      }])
      break
    }
    case '/v1/book/9787111187776': {
      res.json({
        'title': '算法导论',
        'author': '[美] Thomas H.Cormen / Charles E.Leiserson / Ronald L.Rivest / Clifford Stein',
        'ISBN': '9787111187776'
      })
      break
    }
    default: {
      res.end(JSON.stringify({ a: req.url }))
    }
  }
}).listen(4444, function () {})
