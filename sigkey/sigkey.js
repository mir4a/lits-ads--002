var path = require('path'),
  process = require('process'),
  fs = require('fs'),
  fileName = path.basename(__filename, '.js');

var CHAR_SET = 'abcdefghijklmnopqrstuvwxyz';
/**
 * a = 0; total = 0
 * b = 1; total = 1
 * c = 2; total = 3
 * d = 3; total = 6
 * e = 4; total = 10
 * f = 5; total = 15
 * g = 6; total = 21
 * h = 7; total = 28
 * i = 8; total = 36
 * j = 9; total = 45
 * k = 10; total = 55
 * l = 11; total = 66
 * m = 12; total = 78
 * n = 13; total = 91
 * o = 14; total = 105
 * p = 15; total = 120
 * q = 16; total = 136
 * r = 17; total = 153
 * s = 18; total = 171
 * t = 19; total = 190
 * u = 20; total = 210
 * v = 21; total = 231
 * w = 22; total = 253
 * x = 23; total = 276
 * y = 24; total = 300
 * z = 25; total = 325
 *
 */

var CHAR_HASH = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7,
  i: 8,
  j: 9,
  k: 10,
  l: 11,
  m: 12,
  n: 13,
  o: 14,
  p: 15,
  q: 16,
  r: 17,
  s: 18,
  t: 19,
  u: 20,
  v: 21,
  w: 22,
  x: 23,
  y: 24,
  z: 25
};

var PAIR_HASH = [
  null,
  0,
  1,
  3,
  6,
  10,
  15,
  21,
  28,
  36,
  45,
  55,
  66,
  78,
  91,
  105,
  120,
  136,
  153,
  171,
  190,
  210,
  231,
  253,
  276,
  300,
  325];

var matchCounter = 0;

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

  matchCounter = 0;

  var totalKeys = +data[0];
  var keysSet = new Array(totalKeys);

  for (var i = 0; i < totalKeys; i++) {
    keysSet[i] = data[i + 1];
  }


  compareSubsetRecursive(keysSet);

  console.timeEnd(fileName + ' running time');
  console.log('with result: ' + matchCounter);

  return matchCounter;

}

function iterateThroughPairs(arr, left) {
  var firstEl = arr[left];
  var secondEl;
  var pair = '';
  var pairHash = 0;

  if (arr.length <= 1) {
    return false;
  }

  if (left + 1 >= arr.length) {
    return false;
  }

  for (var i = left; i < arr.length; i++) {
    secondEl = arr[left + i + 1];
    pair = firstEl + secondEl;
    pairHash = calculateHashFromString(pair);
    if (pairHash === PAIR_HASH[[pair].length]) {
      matchCounter++;
      swap(arr, i, left + 1);
      break;
      iterateThroughPairs(arr, left + 2);
    }
  }
  iterateThroughPairs(arr, left + 1);
}


function comparePairHashWithReference(pair) {
  var hash = calculateHashFromString(pair);
  return hash === PAIR_HASH[pair.length];
}

function compareSubsetRecursive(arr) {
  var firstEl = arr.shift();
  var arrLength = arr.length;
  var twoKeys = '';
  var twoKeysHash = 0;

  while (arrLength >= 1) {
    for (var i = 0; i < arrLength; i++) {
      twoKeys = firstEl + arr[i];
      if (comparePairHashWithReference(twoKeys)) {
        matchCounter++;
        arr.splice(i,1);
        break;
      }
    }
    firstEl = arr.shift();
    arrLength = arr.length;

  }

}

function calculateHashFromString(str) {
  var total = 0;
  for (var i=0; i < str.length; i++) {
    total += CHAR_HASH[str[i]];
  }
  return total;
}

function compare(a,b) {
  return a < b;
}

function getFirstNChars(charSet, charsNumber) {
  return charSet.slice(0, charsNumber);
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

