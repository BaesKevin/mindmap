function VisNetworkData(nodes, edges) {
    this.nodes = nodes !== undefined ? nodes : new vis.DataSet();
    this.edges = edges !== undefined ? edges : new vis.DataSet();
}