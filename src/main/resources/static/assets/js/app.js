$(document).foundation();

$(document).ready(function(){
   initVis();
   document.getElementById("exportForm").onsubmit = exportNetwork;
   document.getElementById("importForm").onsubmit = importNetwork;

   importNetwork();



});

let network;
let data;
let nodes;
let edges;

function initVis(){
//     // create an array with nodes
//     nodeData = [
//         {id: 1, label: 'Node 1', title: 'I have a popup!'},
//         {id: 2, label: 'Node 2', title: 'I have a popup!'},
//         {id: 3, label: 'Node 3', title: 'I have a popup!'},
//         {id: 4, label: 'Node 4', title: 'I have a popup!'},
//         {id: 5, label: 'Node 5', title: 'I have a popup!'}
//     ];
//
//     edgeData = [
//         {from: 1, to: 3},
//         {from: 1, to: 2},
//         {from: 2, to: 4},
//         {from: 2, to: 5}
//     ];
//
//     nodes = new vis.DataSet(nodeData);
//     edges = new vis.DataSet(edgeData);

    let container = document.getElementById('mynetwork');

    // data = {
    //     nodes: nodes,
    //     edges: edges
    // };
    let options = {
        interaction:{hover:true},
        manipulation: {
            enabled: true,
            editNode: editNode
        },
        edges: {
            arrows: 'to',
            smooth: {
                type: "cubicBezier",
                forceDirection: "none",
                roundness: 1
            }
        },
        layout:{
            hierarchical:{
                enabled: true,
                direction: "LR"
            }
        },
        physics: {
            enabled: false
        }
    };
    network = new vis.Network(container, data, options);

}

function editNode(data, callback) {
    // filling in the popup DOM elements
    document.getElementById('operation').innerHTML = "Edit Node";
    document.getElementById('node-label').value = data.label;
    document.getElementById('saveButton').onclick = saveData.bind(this, data, callback);
    document.getElementById('cancelButton').onclick = cancelEdit.bind(this,callback);

    let networkPopup = document.getElementById('network-popUp');
    networkPopup.className = "";
    let labelInput = document.querySelector("input#node-label");
    labelInput.setSelectionRange(0, labelInput.value.length);
}

function saveData(data,callback) {
    data.label = document.getElementById('node-label').value;
    clearPopUp();
    callback(data);
}

function clearPopUp() {
    document.getElementById('saveButton').onclick = null;
    document.getElementById('cancelButton').onclick = null;
    document.getElementById('network-popUp').className = "hidden";
}

function cancelEdit(callback) {
    clearPopUp();
    callback(null);
}



function exportNetwork(e) {
    e.preventDefault();

    console.log(nodes.get());
    console.log(edges.get());

    let exportData = {
        nodeData: nodes.get(),
        edgeData: edges.get()
    };

    localStorage.setItem("network", JSON.stringify(exportData));
}

function importNetwork(e) {
    if(e){
        e.preventDefault();
    }

    let networkFromStorage = localStorage.getItem("network");

    if(networkFromStorage !== null){
        let networkData = JSON.parse(networkFromStorage);
        nodes = new vis.DataSet(networkData.nodeData);
        edges = new vis.DataSet(networkData.edgeData);

    } else {
        nodes = new vis.DataSet();
        edges = new vis.DataSet();
    }

    data = {
        nodes: nodes ,
        edges: edges
    };

    initVis(data);

}

function addConnections(elem, index) {
    // need to replace this with a tree of the network, then get child direct children of the element
    elem.connections = network.getConnectedNodes(index);
}

function getNodeData(data) {
    let networkNodes = [];

    data.forEach(function(elem, index, array) {
        networkNodes.push({id: elem.id, label: elem.id, x: elem.x, y: elem.y});
    });

    return new vis.DataSet(networkNodes);
}

function getNodeById(data, id) {
    for (let n = 0; n < data.length; n++) {
        if (data[n].id == id) {  // double equals since id can be numeric or string
            return data[n];
        }
    };

    throw 'Can not find id \'' + id + '\' in data';
}

function getEdgeData(data) {
    let networkEdges = [];

    data.forEach(function(node) {
        // add the connection
        node.connections.forEach(function(connId, cIndex, conns) {
            networkEdges.push({from: node.id, to: connId});
            let cNode = getNodeById(data, connId);

            let elementConnections = cNode.connections;

            // remove the connection from the other node to prevent duplicate connections
            let duplicateIndex = elementConnections.findIndex(function(connection) {
                return connection == node.id; // double equals since id can be numeric or string
            });


            if (duplicateIndex != -1) {
                elementConnections.splice(duplicateIndex, 1);
            };
        });
    });

    return new vis.DataSet(networkEdges);
}

function objectToArray(obj) {
    return Object.keys(obj).map(function (key) {
        obj[key].id = key;
        return obj[key];
    });
}