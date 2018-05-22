function addOnlineOfflineEventListeners(){
    
    window.addEventListener('online',  updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
}

function updateOnlineStatus(event) {
    var condition = navigator.onLine ? "online" : "offline";

    document.getElementById("networkstatus").innerHTML = condition;

    console.log("Device network status: " + navigator.onLine);
}