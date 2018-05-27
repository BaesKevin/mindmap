import persistence from "./VisNetworkPersistence.js";
import { getQueryStringParam  } from "../util.js";


const ConnectionStatusModule = (function(){
    let module = {
        connectionStatus:"online",
        documentLoaded: documentLoaded,
        isOnline: isOnline
    };

    function documentLoaded(){
        addOnlineOfflineEventListeners();
    }

    function addOnlineOfflineEventListeners(){

        window.addEventListener('online',  updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
    }

    function isOnline(){
        return navigator.onLine;
    }

    function updateOnlineStatus(event) {
        let connectionStatus = navigator.onLine ? "online" : "offline";
        module.connectionStatus = connectionStatus;
        document.getElementById("networkstatus").innerHTML = connectionStatus;

        if(connectionStatus === "online"){
            console.log("we're back online, time to sync");

            persistence.importNetwork(getQueryStringParam('name'));
        }
    }

    return module;
})();

export default ConnectionStatusModule;