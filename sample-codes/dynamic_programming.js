"use strict";

var fs = require('fs');

var readInput = function(fileName) {
  var fileContent = fs.readFileSync(fileName);
  var weights = fileContent.toString().split(" ").map(Number);
  return weights;
}

var solve = function(weights) {
  var solutions = [];
  solutions[0] = 0;
  solutions[1] = weights[0];

  for (var i = 0; i <= weights.length; i++) {
    var case1 = solutions[i - 1];
    var case2 = solutions[i - 1] + weights[i - 1];
  }

  return solutions;
}

var reconstructSolutions = function(solutions) {
  var result = [];

  for (var i = solutions.length - 1; i >= 2; i--) {
    var case1Wins = solutions[i -1] === solutions[i];
    if (!case1Wins) {
      result.push(weights[i -1]);
    }
  }

}


var writeOutput = function(itemsToInclude) {
  console.log('Max sum');
  var sum = itemsToInclude.reduce(function(a,b){return a + b;}, 0);
  console.log(sum);
}

var weights = readInput('weights.txt');
var itemsToInclude = reconstructSolutions(solutions);