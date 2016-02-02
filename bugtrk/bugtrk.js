const fs = require('fs');
const process = require('process');
const path = require('path');
const fileName = path.basename(__filename, '.js');

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
  fs.readFile(fileName, { encoding: 'utf-8' }, function ( err, data ) {
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
  data = data.split(' ');

  var totalCards = +data[0];
  var cardWidth = +data[1];
  var cardHeight = +data[2];

  return calculateBoard(totalCards, cardWidth, cardHeight);

}


function calculateBoard(cards, width, height) {
  if (cards === 2) {
    return Math.min(width, height) * 2;
  }
  var totalSquare = cards * (width * height);
  var boardMin = width === height ? Math.sqrt(totalSquare) : -~Math.sqrt(totalSquare);
  var boardMax = boardMin + 1;

  var boardMinWidthCards = ~~(boardMin/width);
  var boardMinHeightCards = ~~(boardMin/height);
  var boardMinCards= boardMinWidthCards * boardMinHeightCards;

  var boardMaxWidthCards = ~~(boardMax/width);
  var boardMaxHeightCards = ~~(boardMax/height);
  var boardMaxCards = boardMaxWidthCards * boardMaxHeightCards;

  if (boardMinCards >= cards) {
    return boardMin;
  } else if (boardMaxCards >= cards) {
    return boardMax;
  } else {
    return Math.ceil(cards/2);
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

