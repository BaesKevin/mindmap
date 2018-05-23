let VisNetwork = (function () {
    function editNode(data, callback) {
        let editNodeModal = $('#editNodeModal');

        editNodeModal.find("#new_node_text").val(data.label);
        editNodeModal.find('#btn_confirm_edit')[0].onclick = saveData.bind(this, data, callback);
        editNodeModal.find('.close-button')[0].onclick = cancelEdit.bind(this, callback);

        editNodeModal.foundation('open');
    }

    function saveData(data, callback) {
        data.label = $('#new_node_text').val();
        $('#editNodeModal').foundation('close');
        callback(data);
    }

    function cancelEdit(callback) {
        callback(null);
    }

    const visNetworkOptions = {
        interaction: { hover: true },
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

    

    function VisNetwork(container, networkData) {
        // let container = document.querySelector('mynetwork');
        this.networkData = networkData;
        this.network = new vis.Network(container,networkData, visNetworkOptions);
    }

    // expects a VisNetworkData object
    VisNetwork.prototype.initOrUpdateNetwork = function (data) {
        this.networkData = data;
        this.network.setData({ nodes: data.nodes, edges: data.edges });
    }


    

    return VisNetwork;
})();

