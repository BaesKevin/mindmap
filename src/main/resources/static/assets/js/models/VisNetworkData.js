function VisNetworkData(name, nodes, edges) {
	this.name = name;
    this.nodes = nodes !== undefined ? nodes : new vis.DataSet();
    this.edges = edges !== undefined ? edges : new vis.DataSet();

    this.nodes = cleanNodes(this.nodes);
}

VisNetworkData.prototype.getJson = function(){
    return {
        name: this.name,
        nodes: this.nodes.get(),
        edges: this.edges.get()
    }
};


// first check if there are an equal amount of nodes and edges
// then check each property of a node from storage against the matching property
// of a node from the server
VisNetworkData.prototype.equals = function areNetworksEqual(newData){
    if(this.nodes.length !== newData.nodes.length || this.edges.length !== newData.edges.length){
        return false;
    }

    // TODO remove duplication
    let areEqual = true;
    this.nodes.get().forEach(function(oldNode){
        let newNode = newData.nodes.get().find(node => node.id == oldNode.id);

        if(!newNode){
            areEqual = false;
        }

        for(let key in oldNode){
            let oldVal = oldNode[key];
            let newVal = newNode[key];

            if(!(oldNode.hasOwnProperty(key) && oldVal === newVal)){

                // account for precision error on floats
                if(isNumeric(oldNode[key])){
                    let numbersAreCloseEngough = Math.floor(oldVal) === Math.floor(newVal);

                    if(!numbersAreCloseEngough){
                        areEqual = false;
                    }
                } else {
                    areEqual = false;
                }
            }
        }
    });

    this.edges.get().forEach(function(oldEdge){
        let newEdge = newData.edges.get().find(edge => edge.id == oldEdge.id);

        if(!newEdge){
            areEqual = false;
        }

        for(let key in oldEdge){
            if(!(oldEdge.hasOwnProperty(key) && oldEdge[key] === newEdge[key])){
                areEqual = false;
            }
        }
    });

    return areEqual;
};

// removes excessive properties from the Vis framework that we don't use, like the node font
function cleanNodes(nodes){
    let cleanNodes = [];

    nodes.forEach(node => {

        let cleanNode = {
            id: node.id,
            label: node.label,
            x: node.x,
            y: node.y
        }
        
        cleanNodes.push(cleanNode);
    });
    
    return new vis.DataSet(cleanNodes);
}

export default VisNetworkData;