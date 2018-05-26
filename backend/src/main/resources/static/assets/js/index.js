const url = "/mindmap/names";

// TODO also compare with localstorage and delete unused networks
function getNetworkNames(){
	return fetch(url, {credentials: 'same-origin'}).then(response => response.json());
}

function init(){
	console.log('asdf');
	getNetworkNames().then(names => {
		let networkNamesListContainer = $('#networkList');
		
		if(names.length > 0){
			let list = "<div class='cell large-4 large-offset-4 small-8 small-offset-2'><ul  class='no-bullet'>"; 
			names.forEach(name => {
				list += `<li ><a class='mindmap-listitem' href="/mindmap.html?name=${name}">${name}</a></li>`;
			})
			
			list += "</ul></div>";
			
			networkNamesListContainer.html(list);
		} else {
			networkNamesListContainer.children('span').text("You don't have any networks yet, try creating one by entering a name in the text field above.");
		}
		
	}).catch(error=> {console.info("couldn't get network names"); throw error;});
}

function getLoggedInUser(){
	fetch('/user', { credentials: 'same-origin'}).then(response => response.json()).then(console.log);
}

$(document).ready(function(){
	init();
});