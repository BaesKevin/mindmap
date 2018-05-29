import 'script-loader!jquery/dist/jquery.min.js';
import "script-loader!vis/dist/vis-network.min.js";
import "script-loader!what-input/dist/what-input.min.js";
import "script-loader!foundation-sites/dist/js/foundation.min.js";
import 'script-loader!localforage/dist/localforage.min.js';

import VisNetwork from "./models/VisNetwork.js";
import VisNetworkData from "./models/VisNetworkData.js";
import ConnectionStatusModule from "./models/ConnectionStatusModule.js";
import persistence from "./models/VisNetworkPersistence.js";
import { getQueryStringParam } from "./util.js";

import "../node_modules/foundation-sites/dist/css/foundation.min.css";
import "../node_modules/vis/dist/vis-network.min.css";
import "../css/app.css";

$(document).foundation();

$(document).ready(function(){

    let networkName = getQueryStringParam('name');
    let container = document.getElementById('mynetwork');
    let network = new VisNetwork(container, new VisNetworkData(networkName));

    persistence.documentLoaded(network);

    $('h1').text(networkName);
    document.getElementById("exportButton").onclick = function(e){
        e.preventDefault();
        persistence.exportNetwork();
    };
    document.getElementById("saveAndQuitButton").onclick = function saveAndGoHome(e) {
        e.preventDefault();
    
        persistence.exportNetwork(network);
        location.href = "/";
    };

    setConnectionStatusText(ConnectionStatusModule.isOnline());
    window.addEventListener('online',  connectionStatusChanged);
    window.addEventListener('offline', connectionStatusChanged);

});

function connectionStatusChanged(event) {
    let isOnline=  ConnectionStatusModule.isOnline();
    setConnectionStatusText(isOnline);

    if(isOnline){
        console.log("we're back online, time to sync");

        persistence.importNetwork(getQueryStringParam('name'));
    }
}

function setConnectionStatusText(isOnline){
    if(isOnline){
        document.getElementById("networkstatus").innerHTML = "online";
    } else {
        document.getElementById("networkstatus").innerHTML = "offline";
    }
}