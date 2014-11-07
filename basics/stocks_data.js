var async = require('async');
var fse = require('fs-extra');
var fs = require('fs-extra');
var yahooFinance = require('yahoo-finance');
var json2csv = require('json2csv');

var tickers = "AAPL,GOOG,ABT,ACN";
// var tickers = "AAPL,ABBV,ABT,ACN,AIG,ALL,AMGN,AMZN,APA,APC,AXP,BA,BAC,BAX,BIIB,BK,BMY,BRK.B,C,CAT,CL,CMCSA,COF,COP,COST,CSCO,CVS,CVX,DD,DIS,DOW,DVN,EBAY,EMC,EMR,EXC,F,FB,FCX,FDX,FOXA,GD,GE,GILD,GM,GOOG,GS,HAL,HD,HON,HPQ,IBM,INTC,JNJ,JPM,KO,LLY,LMT,LOW,MA,MCD,MDLZ,MDT,MET,MMM,MO,MON,MRK,MS,MSFT,NKE,NOV,NSC,ORCL,OXY,PEP,PFE,PG,PM,QCOM,RTN,SBUX,SLB,SO,SPG,T,TGT,TWX,TXN,UNH,UNP,UPS,USB,UTX,V,VZ,WAG,WFC,WMT,XOM";
var dateTo = '2014-11-03';
var dateFrom = '2014-11-01';
var dir = './data';

function processFinish(err, res) {

	console.log("Error: ", err);
	console.log("Res: ", res);
}

function processTicker(ticker, done) {

	function downloadHistory(done) {
		yahooFinance.historical({
			symbol: ticker,
			from: dateFrom,
			to: dateTo,
		}, done);
	}

	function convertToCsv(res, done) {
		if(res.length === 0)
			return done(true);

		json2csv({data: res, fields: Object.keys(res[0])}, done);
	}

	function saveDataToFile(res, done) {
		fs.writeFile( dir+'/'+ticker+'.csv', res, done);
	}

	console.log("Zpracovavam: "+ ticker);

	async.waterfall([
		downloadHistory,
		convertToCsv,
		saveDataToFile
	], function(err, res) {

		done(null, !err);
	});
	
	// verze s pouzitim async auto a mapy zavislosti
	// function getWeather(done) {
	// 	done(null, "Je hezky");
	// }
	// 
	// async.auto({
	// 	weather: getWeather,
	// 	data: downloadHistory,
	// 	csvData: ['data', convertToCsv],
	// 	result: ['csvData', 'weather', saveDataToFile] // funkce ceka na dokonceni vice nez jednoho predchudce
	// }, done);
}

function importData(tickers) {
	var tList = tickers.split(",");
	async.mapLimit(tList, 2, processTicker, processFinish);
}

fse.ensureDir(dir, function(err) {
	if(err)
		throw err;

	importData(tickers);
});
