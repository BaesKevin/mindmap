const url = "/mindmap/names";

function getNetworkNames(){
	return fetch(url, {credentials: 'same-origin'}).then(response => response.json());
}

function init(){
	console.log('asdf');
	getNetworkNames().then(names => {
		let networkNamesListContainer = $('#networkList');
		
		if(names.length > 0){
			let list = "<ul>"; 
			names.forEach(name => {
				list += `<li><a href="/mindmap.html?name=${name}">${name}</a></li>`;
			})
			
			list += "</ul>";
			
			networkNamesListContainer.html(list);
		} else {
			networkNamesListContainer.html("You don't have any networks yet, try creating one by using the text field above.");
		}
		
	}).catch(error=> {console.info("couldn't get network names"); throw error;});
}

function getLoggedInUser(){
	fetch('/user', { credentials: 'same-origin'}).then(response => response.json()).then(console.log);
}

$(document).ready(function(){
	init();
});