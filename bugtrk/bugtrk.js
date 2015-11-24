var path = require('path'),
  process = require('process'),
  fs = require('fs'),
  fileName = path.basename(__filename, '.js');


/**
 * Get the arguments of script call except first two (program name and script name)
 * and return arguments or script name without extensions
 * @param arg
 * @returns {*}
 */
function splitArguments( arg ) {
  return arg.length > 2 ? arg.splice(2) : fileName;
}

var inputs = splitArguments(process.argv);

/**
 * Helper for setting up filelist with particular extension
 * @param inputs
 * @param ext
 * @returns {*}
 */
function fileListHelper( inputs, ext ) {
  var fileList = [],
    ext = ext || '.in';

  if ( typeof inputs !== 'string' ) {
    fileList = [];
    inputs.forEach(function ( val, i, array ) {
      fileList.push(val + ext);
    });
  } else {
    fileList.push(inputs + ext);
  }
  return fileList;
}

var inputFiles = fileListHelper(inputs);

/**
 * Get results from Main script and write to out files
 * @param inputName
 * @param data
 */
function scriptHandler( inputName, data ) {
  var result;
  var outName = inputName.replace('.in', '.out');
  result = mainScript(data.toString());

  fs.writeFile(outName, result);
}

/**
 * File read helper which is run callback with file name and file data
 * @param fileName
 * @param cb
 */
function readFileHandler( fileName, cb ) {
  fs.readFile(fileName, function ( err, data ) {
    if ( err ) throw err;

    cb(fileName, data);

  });
}

/**
 * Main script which is calculate all the logic and returns the final result of algorithm
 * @param data
 * @returns {*}
 */
function mainScript( data ) {
  console.time(fileName + ' running time');
  data = data.split('\n');

  var boardSize = 0;

  var totalCards = +data[0];
  var cardWidth = +data[1];
  var cardHeight = +data[2];

  for (var i = 0; i < totalKeys; i++) {
    keysSet[i] = data[i + 1];
  }



  console.timeEnd(fileName + ' running time');

  return matchCounter;

}

function totalSqare(cards, width, height) {
  return cards * (width + height);
}

function calculateBoard(cards, width, height) {
  var widthTotal = width * cards;
  var heightTotal = height * cards;

  if (widthTotal === heightTotal) {
    return widthTotal;
  } else if (widthTotal > heightTotal) {

  } else {

  }
}


/**
 * Swap tow elements in array
 * @param arr
 * @param posA
 * @param posB
 */
function swap( arr, posA, posB ) {
  var temp = arr[posA];
  arr[posA] = arr[posB];
  arr[posB] = temp;
}




inputFiles.forEach(function ( val, index, array ) {
  readFileHandler(val, scriptHandler);
});

