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

// straight from ye olde faithful https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric/1830844#1830844 
function isNumeric(value) {
	return !isNaN(value - parseFloat(value));
}