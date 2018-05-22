
// posts data and returns json
function postData(url, data) {
    // Default options are marked with *
    return fetch(url, {
        body: JSON.stringify(data),
        credentials: 'same-origin',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST'
    })
}

function getQueryStringParam(name){
	let urlParams = new URLSearchParams(window.location.search);
	
	return urlParams.get(name);
}
