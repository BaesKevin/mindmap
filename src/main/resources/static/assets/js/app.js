$(document).foundation();

$(document).ready(function(){
   document.getElementById("exportForm").onsubmit = exportNetwork;
   document.getElementById("importForm").onsubmit = importNetwork;

   importNetwork();
});

let network;
let data;
let nodes;
let edges;

function initNetwork(data){
    let container = document.getElementById('mynetwork');

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

    let exportData = {
        nodeData: nodes.get(),
        edgeData: edges.get()
    };

    localforage
        .setItem('network', JSON.stringify(exportData))
        .catch(console.error);
}

function importNetwork(e) {
    if(e){
        e.preventDefault();
    }

    localforage.getItem('network')
        .then( networkFromStorage => {
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

            initNetwork(data);
        })
        .catch(console.error);



}
