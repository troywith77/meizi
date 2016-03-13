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

	var meizi = $('#picture img').toArray().length !== 0 ? $('#picture img').toArray() : $('.postContent img').toArray();
	//以前的html容器的class和现在的id不同
	meizi.map(function(item) {
		var imgPath = item.attribs.src;
		var fileName = parseUrlToFileName(imgPath);
		downloadImg(imgPath, fileName, function() {
			console.log(fileName + ' done.');
		})
	})
}

function parseUrlToFileName(addr) {
	return addr.substr(42).replace(/\//g, '-');
}

var downloadImg = function(url, filename, callback) {

	request(url, function(err, res, body) {
		if (err) {
			console.log('err: ' + err);
			return false;
		}
		request(url).pipe(fs.createWriteStream('/Users/troy/Pictures/meizi/' + filename)).on('close', callback);
	});
};
