const readline = require('readline');
const fs = require('fs');
const process = require('process');
const path = require('path');
const Graph = require('./graph').Graph;
const Vertex = require('./graph').Vertex;
const Edge = require('./graph').Edge;
const BinaryHeap = require('./binary-heap');

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

inputFiles.forEach(function ( val, index, array ) {
  readFileHandler(val, scriptHandler);
});

function buildGraph( data ) {
  var data = data.split('\n');
  var verticesLength = +data[0].split(' ')[0];
  var edgesLength = +data[0].split(' ')[1];
  var clients = data[1].split(' ').map((num)=> +num);
  var vertices = {};
  var edges = [];

  for (var i = 2; i < edgesLength; i++) {
    var edge, reverseEdge;
    var startVertex, endVertex, weight;

    var _data = data[i].split(' ');
    startVertex = _data[0];
    endVertex = _data[1];
    weight = +_data[2];

    if (!(startVertex in vertices)) vertices[startVertex] = new Vertex(startVertex, (startVertex in clients));
    if (!(endVertex in vertices)) vertices[endVertex] = new Vertex(endVertex, (endVertex in clients));

    edge = new Edge(vertices[startVertex], vertices[endVertex], weight);
    vertices[startVertex].outboundEdges.push(edge);

    reverseEdge = new Edge(vertices[endVertex], vertices[startVertex], weight);
    vertices[endVertex].outboundEdges.push(reverseEdge);

    edges.push(edge);
    edges.push(reverseEdge)
  }

  return new Graph(vertices, edges);
}

function mainScript( data ) {


  var graph = buildGraph(data);

  var maxLatency = solve(graph);

  return maxLatency;
}

function solve(graph) {
  var maxLatency = 10e14;

  for (label in graph.vertices) {
    var vertex = graph.vertices[label];
    if (!vertex.isClient) {
      var distances = dijikstra(graph, vertex);
      var max = [];
      distances.forEach((el) => { if (el[1]) max.push(el[0])});
      maxLatency = Math.min(maxLatency, Math.max.apply(null, max));
    }
  }

  return maxLatency;
}

function dijikstra(graph, startVertex) {
  const INFINITY = 10e14;
  var distances = {};
  for (label in graph.vertices) {
    distances[label] = INFINITY;
  }
  distances[startVertex.label] = 0;

  var heap = new BinaryHeap((x)=>{return x.distance});
  heap.push({vertex:startVertex,distance:0});

  var result = [];

  while (heap.size() > 0) {
    var topHeap = heap.pop();
    var distance = topHeap.distance;
    var shortestDistanceVertex = topHeap.vertex;


    shortestDistanceVertex.outboundEdges.forEach((edge) =>{
      var neighbourVertex = edge.endVertex;
      var alternateDistance = distances[shortestDistanceVertex.label] + edge.weight;

      if (alternateDistance < distances[neighbourVertex.label]) {
        distances[neighbourVertex.label] = alternateDistance;
        heap.push({vertex: neighbourVertex, distance:alternateDistance});
      }
    });
  }

  for (vertex in graph.vertices) {
    result.push([distances[vertex], graph.vertices[vertex].isClient]);
  }

  return result;

}

