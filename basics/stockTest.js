var fs = require("fs");
var async = require("async")
var yahooFinance = require('yahoo-finance');
var json2csv = require('json2csv');

// var tickers = "AAPL,22EK,GOOG,KO";
var tickers = "AAPL,ABBV,ABT,ACN,AIG,ALL,AMGN,AMZN,APA,APC,AXP,BA,BAC,BAX,BIIB,BK,BMY,BRK.B,C,CAT,CL,CMCSA,COF,COP,COST,CSCO,CVS,CVX,DD,DIS,DOW,DVN,EBAY,EMC,EMR,EXC,F,FB,FCX,FDX,FOXA,GD,GE,GILD,GM,GOOG,GS,HAL,HD,HON,HPQ,IBM,INTC,JNJ,JPM,KO,LLY,LMT,LOW,MA,MCD,MDLZ,MDT,MET,MMM,MO,MON,MRK,MS,MSFT,NKE,NOV,NSC,ORCL,OXY,PEP,PFE,PG,PM,QCOM,RTN,SBUX,SLB,SO,SPG,T,TGT,TWX,TXN,UNH,UNP,UPS,USB,UTX,V,VZ,WAG,WFC,WMT,XOM";
var dateTo = '2014-11-03';
var dateFrom = '2014-11-01';
var dir = './data';

var processTicker = function(ticker, done) {

	this.downloadData = function(done) {

		yahooFinance.historical({
			symbol: ticker,
			from: dateFrom,
			to: dateTo,
		}, done);
	}

	this.convertToCsv = function(res, done) {
		if(res.length === 0)
			return done(true);

		json2csv({data: res, fields: Object.keys(res[0])}, done);
	}

	this.saveToFile = function(res, done) {
		fs.writeFile(dir+'/'+ticker+'.csv', res, done);
	}

	console.log("Zpracovavam: ", ticker);

	async.waterfall([
		this.downloadData,
		this.convertToCsv,
		this.saveToFile
	], function(err, res) {

		done(null, !err);
	});
};


function importData(tickers) {

	async.mapLimit(tickers.split(","), 5, processTicker, function(err, res) {
		console.log("Error: ", err);
		console.log("Result: ", res);
	});
}


importData(tickers);