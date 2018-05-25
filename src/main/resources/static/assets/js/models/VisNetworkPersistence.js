const persistenceModule = (function(){

    function exportNetwork(network) {
        exportNetworkToStorage(network.networkData.getJson());
        exportNetworkToServer(network.networkData.getJson()).then(_ => {
            $('[data-toggle="offCanvas"]').click();
        });
    }



    function exportNetworkToStorage(data) {
        localforage
            .setItem(data.name, JSON.stringify(data))
            .catch(error => console.info("LocalForage couldn't save network " + networkName));
    }

    function exportNetworkToServer(data) {

        return postData("/savemindmap", data)
            .then(response => {
                    return Promise.resolve(response.text());
                }
            )
            .catch(error => {
                console.info("couldn't save network to server"); throw error;
            });
    }

// load the network from storage and server, check if they match, overwrite
// server with localstorage
// TODO give the user a choice to overwrite server with localstorage or vice
// versa,
// useful when the user worked in a different browser or on a different device
    function importNetwork(networkName) {


        if (!networkName) {
            location.href = "/";
        }

        loadNetworkFromStorage(networkName)
            .then(storageData => {
                loadNetworkFromserver(networkName).then(networkData => {
                    let isServerSynced = storageData.equals(networkData);
                    console.log("Server is synced: " + isServerSynced);

                    if (!isServerSynced) {
                        syncBasedOnUsersChoice(storageData, networkData);
                    } else {
                        network.initOrUpdateNetwork(networkData);
                    }

                });
            });


    }

// if the user wants to keep their local changes, push local changes to the
// server and init the network with local data
// else pull the remote changes, update local storage and load the network with
// remote changes
    function syncBasedOnUsersChoice(dataFromStorage, dataFromServer) {
        console.log("Server is not in sync: sync data");

        let syncStrategyModal = $('#chooseSyncStrategyModal');

        syncStrategyModal.find('[data-sync-strategy="overwriteServer"]').one('click', function (e) {
            e.preventDefault();

            exportNetworkToServer(dataFromStorage.getJson()).then(_ => console.log("sync successful"));
            network.initOrUpdateNetwork(dataFromStorage);
            syncStrategyModal.foundation("close");
        });

        syncStrategyModal.find('[data-sync-strategy="overwriteStorage"]').one('click', function (e) {
            e.preventDefault();

            exportNetworkToStorage(dataFromServer.getJson());
            network.initOrUpdateNetwork(dataFromServer);
            syncStrategyModal.foundation("close");
        });

        syncStrategyModal.foundation('open');
    }


    function loadNetworkFromserver(name) {
        return fetch("mindmap/" + name, {
            credentials: 'same-origin'
        })
            .then(response => response.json())
            .then(json => {
                let networkData = new VisNetworkData(json.name, new vis.DataSet(json.nodes),new vis.DataSet(json.edges))

                return Promise.resolve(networkData);
            })
            .catch(error => {
                console.info("network not found on server");
                console.log(error);
            });

    }

    function loadNetworkFromStorage(networkName) {
        return localforage.getItem(networkName)
            .then(networkFromStorage => {

                return Promise.resolve(createDataFromNetworkFromStorage(networkFromStorage));
            })
            .catch(error => console.info("network not found in storage"));
    }

    function createDataFromNetworkFromStorage(networkFromStorage) {
        let newnodes, newedges, name;
        if (networkFromStorage !== null) {
            let networkData = JSON.parse(networkFromStorage);
            newnodes = new vis.DataSet(networkData.nodes);
            newedges = new vis.DataSet(networkData.edges);
            name = networkData.name;
        }
        else {
            console.log('the impossible happened');
            newnodes = new vis.DataSet();
            newedges = new vis.DataSet();
        }

        return new VisNetworkData(name, newnodes, newedges);
    }

    return {
        exportNetwork, importNetwork
    }
})();
