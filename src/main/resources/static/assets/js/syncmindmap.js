function addOnlineOfflineEventListeners(){
    
    window.addEventListener('online',  updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
}

function updateOnlineStatus(event) {
    var condition = navigator.onLine ? "online" : "offline";

    document.getElementById("networkstatus").innerHTML = condition;
    
    if(condition === "online"){
    	console.log("we're back online, time to sync");
    	
    	importNetwork();
    }
}