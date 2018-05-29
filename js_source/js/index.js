import 'script-loader!jquery/dist/jquery.min.js';
import 'script-loader!localforage/dist/localforage.min.js';
import ConnectionStatusModule from "./models/ConnectionStatusModule.js";
import "../css/foundation/foundation.min.css";
import "../css/app.css";

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

function deleteNetworkHandler(e){
	console.log($(this).data('network-to-delete'));
	let networkName = $(this).data('network-to-delete');
	deleteNetworkFromServer(networkName)
		.then(_ => {
			return localforage.removeItem(networkName);
		})
		.then(
			_ => getNamesFromStorage()
				.then(names => { initNetworkNamesList(names); })
		).then(_ => console.log("reinitialized page"));
}

function deleteNetworkFromServer(networkName){
	return fetch('/api/deletemindmap', 
		{
			body: networkName,
			credentials: 'same-origin',
			headers: {
				'content-type': 'application/json'
			},
			method: 'POST'
		}).catch(error => "couldn't delete network");
}

function init() {
	$('#networkList').on('click', '[data-network-to-delete]', deleteNetworkHandler);

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
			list += `<li >
				<a class='mindmap-listitem' href="/mindmap.html?name=${name}">${name}</a>
				<a class='mindmap-delete-button' href="#" data-network-to-delete="${name}">Delete</a>
			</li>`;
		})

		list += "</ul></div>";

		networkNamesListContainer.html(list);
	} else{
		networkNamesListContainer.html(`
			
		<span class="cell large-4 large-offset-4 small-10 small-offset-1 medium-8 medium-offset-2">
		You don't have any networks yet, try creating one by entering a name in the text field above.
		</span>
		`);
	}
}

function getLoggedInUser() {
	fetch('/user', { credentials: 'same-origin' }).then(response => response.json()).then(console.log);
}

$(document).ready(function () {
	init();
});