import persistence from "./VisNetworkPersistence.js";
import { getQueryStringParam  } from "../util.js";


const ConnectionStatusModule = (function(){
    let module = {
        isOnline: isOnline
    };

    function isOnline(){
        return navigator.onLine;
    }


    return module;
})();

export default ConnectionStatusModule;