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

  if ( typeof inputs === 'array' ) {
    fileList = [];
    inputs.forEach(function(val, i, array){
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
  var outName = inputName.replace('.in', '.out');
  var result = mainScript(data.toString());

  fs.writeFile(outName, result);
}

/**
 * Fileread helper which is run callback with file name and file data
 * @param fileName
 * @param cb
 */
function readFileHandler(fileName, cb) {
  fs.readFile(fileName, function(err, data) {
    if (err) throw err;

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

  var items = data.split('\n')[0],
    discount = data.split('\n')[1],
    result = null;

  console.log('Items: ' + items + '\nDiscount: ' + discount);

  console.timeEnd(fileName + ' running time');

  return result;
}




inputFiles.forEach(function ( val, index, array ) {
  readFileHandler(val, scriptHandler);
});

