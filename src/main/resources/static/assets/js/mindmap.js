
let network;
let data;
let nodes;
let edges;
let visNetworkOptions = {
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
        physics: {
            enabled: false
        },
        interaction: {
        	navigationButtons: true	
        }
    };


function initNetwork(data){
    let container = document.getElementById('mynetwork');
    network = new vis.Network(container, data, visNetworkOptions);

}

function initOrUpdateNetwork(data){
	// update the global nodes and edges no matter what
	nodes = data.nodes;
	edges = data.edges;
	if(network !== undefined){
		console.info("updating network");
		network.setData({nodes: data.nodes, edges: data.edges});
	} else {
		initNetwork(data);
	}
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

    let networkName = getQueryStringParam('name');
    let exportData = {
        name: networkName,
        nodes: nodes.get(),
        edges: edges.get()
    };
    
    console.log("export data");
    console.log(exportData);

    exportNetworkToStorage(exportData);
    exportNetworkToServer(exportData);
}

function exportNetworkToStorage(data){
	localforage
	    .setItem(data.name, JSON.stringify(data))
	    .catch(error => console.info("LocalForage couldn't save network " + networkName));
}

function exportNetworkToServer(data){

    postData("/savemindmap", data)
    	.then(response => {
    			$('[data-toggle="offCanvas"]').click();
    			alert("OK");
    			return response.text();
    		}
    	)
    	.catch(error => {
			console.info("couldn't save network to server"); throw error;
    	});
}

function importNetwork(e) {
    if(e){
        e.preventDefault();
    }

    let networkName = getQueryStringParam('name');

    if(!networkName){
    	location.href = "/";
    }
    
    loadNetworkFromStorage(networkName);
    loadNetworkFromserver(networkName);
}

function loadNetworkFromStorage(networkName){
	getNetworkFromStorage(networkName)
	.then(data => {
		console.log("from storage: ");
		console.log(data);
		
		// this should always be faster than the call to the network, on localhost it isn't for some reason
		if(network === undefined){
    		initNetwork(data);
		}
	});
}

function loadNetworkFromserver(name){
	fetch("mindmap/" + name)
    .then(response => response.json())
    .then(json => {
    	let loaded_network_data = {
    		name: json.name,
    		nodes: new vis.DataSet(json.nodes),
    		edges: new vis.DataSet(json.edges)
    	}
    	
    	console.log("from network");
    	console.log(loaded_network_data);
    	initOrUpdateNetwork(loaded_network_data);
    })
    .catch(error => {
    	console.info("network not found on server");
    	console.log(error);
    });
    
}

function getNetworkFromStorage(name){
	return localforage.getItem(name)
    .then( networkFromStorage => {
    	
    	return createDataFromNetworkFromStorage(networkFromStorage);
    })
    .catch(error => console.info("network not found in storage"));
}

function createDataFromNetworkFromStorage(networkFromStorage){
	let newnodes, newedges;
	
	if(networkFromStorage !== null){
        let networkData = JSON.parse(networkFromStorage);
        newnodes = new vis.DataSet(networkData.nodes);
        newedges = new vis.DataSet(networkData.edges);

    } else {
    	newnodes = new vis.DataSet();
    	newedges = new vis.DataSet();
    }

	return {
    	name: name,
        nodes: newnodes ,
        edges: newedges
    };
}

