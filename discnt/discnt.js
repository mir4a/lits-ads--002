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
  var result = [];
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

  var items = data.split('\n')[0].split(' '),
    discount = parseInt(data.split('\n')[1]),
    result = 0,
    sorted;

  if ( items.length < 3 ) {
    for (var i = 0; i < items.length; i++) {
      result += parseInt(items[i]);
    }
  } else {
    //  some advance logic here
    sorted = insertionSort(items);
    result = discntHelper(sorted, discount);
  }


  result = result.toFixed(2);

  console.log('Total money needs: $' + result);
  console.timeEnd(fileName + ' running time');

  return result;
}

function discntHelper( sortedArr, discount ) {
  var result = 0,
    right = 0,
    rightPos = sortedArr.length;

  for (var i = 1; i <= sortedArr.length; i++) {

    var cheapItem = parseInt(sortedArr[i - 1]),
      expensiveItem = parseInt(sortedArr[rightPos - 1]);


    result += cheapItem;


    if ( i % 2 === 0 && rightPos > i) {
      result += (expensiveItem - (expensiveItem * discount / 100));
      right++;
      rightPos = sortedArr.length - right;
    }

    if ( i === rightPos ) break;

  }

  return result;
}

/**
 * Compare two numeric values
 * @param a
 * @param b
 * @returns {boolean}
 */
function compareTwoNumbers( a, b ) {
  return (a - b) > 0;
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


/**
 * Returns new sorted array using Insertion Sort Algorithm
 * @param arr
 * @returns {Array|number}
 */
function insertionSort( array ) {
  var arr = array.slice();

  for (var i = 1; i <= arr.length; i++) {
    var currentPos = i;
    while (currentPos > 0 && compareTwoNumbers(parseInt(arr[currentPos - 1]), parseInt(arr[currentPos]))) {
      swap(arr, currentPos, currentPos - 1);
      currentPos -= 1;
    }
  }
  return arr;
}


inputFiles.forEach(function ( val, index, array ) {
  readFileHandler(val, scriptHandler);
});

