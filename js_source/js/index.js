import 'script-loader!jquery/dist/jquery.min.js';
import 'script-loader!localforage/dist/localforage.min.js';
import ConnectionStatusModule from "./models/ConnectionStatusModule.js";

const url = "/api/mindmap/names";


function getNetworkNames() {
	if(ConnectionStatusModule.isOnline()){
		return getNamesFromNetworkAndDeleteLocalOnlyNetworks();
	} else {
		return getNamesFromStorage();
	}
}

// fetches names from localforage and the server, throws away networks that only exist in localforage
function getNamesFromNetworkAndDeleteLocalOnlyNetworks(){
	return Promise.all(
		[getNamesFromStorage(),getNamesFromNetwork()]
	).then(allNames =>{
		let namesFromStorage = allNames[0];
		let namesFromNetwork = allNames[1];
		return removeLocalOnlyNetworks(namesFromStorage, namesFromNetwork)
			.then(_ => {
				return Promise.resolve(namesFromNetwork)
			});
	}); 
}

function getNamesFromNetwork() {
	return fetch(url, { credentials: 'same-origin' })
		.then(response => response.json());
}

function getNamesFromStorage() {
	return localforage.keys();
}

function removeLocalOnlyNetworks(namesFromStorage, namesFromNetwork) {
	let unusedNames = namesFromStorage.filter(nameFromStorage =>
		!namesFromNetwork.some(nameFromNetwork => nameFromNetwork === nameFromStorage)
	);

	return unusedNames.reduce((deleteChain, unusedName) => {
		return deleteChain.then(localforage.removeItem(unusedName));
	}, Promise.resolve());
}

function hideCreateMindmapFormIfOffline(){
	if(!ConnectionStatusModule.isOnline()){
		$('#form_create_mindmap')
			.html("<p class='text-center'>You are offline. You can work on mindmaps that you've created before.</p>")
	}
}

function initConnectionStatusDetection(){
	window.addEventListener('online',  connectionStatusChanged);
    window.addEventListener('offline', connectionStatusChanged);
}

function connectionStatusChanged(e){
	window.location.reload();
}

function init() {
	hideCreateMindmapFormIfOffline();
	initConnectionStatusDetection();
	getNetworkNames()
		.then(names => { initNetworkNamesList(names); })
		.catch(error => { console.info("couldn't get network names"); throw error; });
}

function initNetworkNamesList(names){
	let networkNamesListContainer = $('#networkList');

	if (names.length > 0) {
		let list = "<div class='cell large-4 large-offset-4 small-8 small-offset-2'><ul  class='no-bullet'>";
		names.forEach(name => {
			list += `<li ><a class='mindmap-listitem' href="/mindmap.html?name=${name}">${name}</a></li>`;
		})

		list += "</ul></div>";

		networkNamesListContainer.html(list);
	} else {
		networkNamesListContainer.children('span').text("You don't have any networks yet, try creating one by entering a name in the text field above.");
	}
}

function getLoggedInUser() {
	fetch('/user', { credentials: 'same-origin' }).then(response => response.json()).then(console.log);
}

$(document).ready(function () {
	init();
});