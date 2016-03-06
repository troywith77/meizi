var fs = require('fs');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

mainFn();

function mainFn() {
	var reqUrl = 'http://www.meizitu.com/a/' + process.argv[2] + '.html';

	request(reqUrl, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			getData(body)
		}
	})
}

function getData(data) {
	var $ = cheerio.load(data);

	var meizi = $('#picture img').toArray();
	var len = meizi.length;
	for (var i = 0; i < len; i++) {
		var imgPath = meizi[i].attribs.src;
		var fileName = parseUrlToFileName(imgPath);
		var fileName = imgPath.substr(42).replace(/\//g, '-');
		downloadImg(imgPath, fileName, function() {
			console.log(fileName + ' done.');
		})
	}
}

function parseUrlToFileName(addr) {
	return path.basename(addr);
}

var downloadImg = function(url, filename, callback) {

	request(url, function(err, res, body) {
		if (err) {
			console.log('err: ' + err);
			return false;
		}
		request(url).pipe(fs.createWriteStream('/Users/troy/Pictures/' + filename)).on('close', callback);
	});
};
