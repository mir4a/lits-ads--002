
function Edge(startVertex, endVertex, weight) {
  this.startVertex = startVertex;
  this.endVertex = endVertex;
  this.weight = weight
}

function Vertex(label, isClient) {
  this.label = label;
  this.outboundEdges = [];
  this.isClient = isClient;
}

function Graph(vertices, edges) {
  this.vertices = vertices;
  this.edges = edges;
}


module.exports = {
  Edge: Edge,
  Vertex: Vertex,
  Graph: Graph
};