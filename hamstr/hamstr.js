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
  console.time(fileName + ' running time');
  data = data.split('\n');

  var food = +data[0];
  var hamstersNumber = +data[1];
  var hamstersSet = new Array(hamstersNumber);

  for (var i = 0; i < hamstersNumber; i++) {
    var subset = data[i + 2].split(' ');
    var appetite = +subset[0];
    var greed = +subset[1];
    var weightIndex = appetite + (greed * (hamstersNumber - 1)); // Set "weight" index for each hamster
    hamstersSet[i] = [appetite, greed, weightIndex];
  }

  quickSort(hamstersSet, 2);

  var totalGreedy = 0;
  var totalConsumption = hamstersSet[0][0];
  var maxHamstersToBuy = 0;

  if ( food < totalConsumption ) {
    return maxHamstersToBuy;
  }

  for (var j = 0; j < hamstersNumber; j++) {
    totalGreedy += hamstersSet[j][1];

    if ( j > 0 ) {
      totalConsumption += hamstersSet[j][0];
    }

    if ( ((totalGreedy * j) + totalConsumption) > food ) {
      return maxHamstersToBuy;
    }
    maxHamstersToBuy++;
  }

  console.timeEnd(fileName + ' running time');

  return maxHamstersToBuy;

}


/**
 * Compare two numeric values
 * @param a
 * @param b
 * @returns {boolean}
 */
function compareTwoNumbers( a, b ) {
  return (b - a) > 0;
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

function getPivot( array, index, left, right ) {
  var index = index || 0;
  return array[left][index];
}

function quickSortRecursive( array, index, left, right ) {
  var index = index || 0;
  var pivot = getPivot(array, 2, left, right);

  var leftWritePos = left;
  var rightWritePos = right;

  while (leftWritePos <= rightWritePos) {
    while (compareTwoNumbers(array[leftWritePos][index], pivot)) {
      leftWritePos += 1;
    }

    while (compareTwoNumbers(pivot, array[rightWritePos][index])) {
      rightWritePos -= 1;
    }

    if ( leftWritePos <= rightWritePos ) {
      if ( leftWritePos !== rightWritePos ) {
        swap(array, leftWritePos, rightWritePos);
      }
      leftWritePos += 1;
      rightWritePos -= 1;
    }
  }

  if ( left < leftWritePos - 1 ) {
    quickSortRecursive(array, 2, left, leftWritePos - 1);
  }

  if ( leftWritePos < right ) {
    quickSortRecursive(array, 2, leftWritePos, right);
  }

}

function quickSort( array, index ) {
  var index = index || 0;
  quickSortRecursive(array, index, 0, array.length - 1);
}


inputFiles.forEach(function ( val, index, array ) {
  readFileHandler(val, scriptHandler);
});

