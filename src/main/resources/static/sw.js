////This is the service worker with the Cache-first network
//
//var CACHE = 'pwabuilder-precache';
//var precacheFiles = [
//    /* Add an array of files to precache for your app */
//    "/index.html",
//    "/assets/css/foundation/foundaton.css",
//    "/assets/css/app.css",
//    "/assets/css/img/network/editIcon.png",
//    "/assets/css/img/network/addNodeIcon.png",
//    "/assets/css/img/network/backIcon.png",
//    "/assets/css/img/network/connectIcon.png",
//    "/assets/css/img/network/cross.png",
//    "/assets/css/img/network/cross2.png",
//    "/assets/css/img/network/deleteIcon.png",
//    "/assets/css/img/network/downArrow.png",
//    "/assets/css/img/network/leftArrow.png",
//    "/assets/css/img/network/minus.png",
//    "/assets/css/img/network/plus.png",
//    "/assets/css/img/network/rightArrow.png",
//    "/assets/css/img/network/upArrow.png",
//    "/assets/css/img/network/zoomExtends.png",
//    "/assets/css/vis-network.min.css",
//    "/assets/js/foundation/foundation.min.js",
//    "/assets/js/foundation/jquery.js",
//    "/assets/js/foundation/what-input.js",
//    "/assets/js/app.js",
//    "/assets/js/localforage.min.js",
//    "/assets/js/vis.js"
//];
//
////Install stage sets up the cache-array to configure pre-cache content
//self.addEventListener('install', function(evt) {
//    console.log('The service worker is being installed.');
//    evt.waitUntil(precache().then(function() {
//            console.log('[ServiceWorker] Skip waiting on install');
//            return self.skipWaiting();
//
//        }).catch(console.error)
//    );
//});
//
//
////allow sw to control of current page
//self.addEventListener('activate', function(event) {
//    console.log('[ServiceWorker] Claiming clients for current page');
//    return self.clients.claim();
//
//});
//
//self.addEventListener('fetch', function(evt) {
//    console.log('The service worker is serving the asset.'+ evt.request.url);
//    evt.respondWith(fromCache(evt.request).catch(fromServer(evt.request)));
//    evt.waitUntil(update(evt.request));
//});
//
//
//function precache() {
//    return caches.open(CACHE).then(function (cache) {
//        return cache.addAll(precacheFiles);
//    });
//}
//
//
//function fromCache(request) {
//    //we pull files from the cache first thing so we can show them fast
//    return caches.open(CACHE).then(function (cache) {
//        return cache.match(request).then(function (matching) {
//            return matching || Promise.reject('no-match');
//        });
//    });
//}
//
//
//function update(request) {
//    //this is where we call the server to get the newest version of the
//    //file to use the next time we show view
//    return caches.open(CACHE).then(function (cache) {
//        return fetch(request).then(function (response) {
//            return cache.put(request, response);
//        });
//    });
//}
//
//function fromServer(request){
//    //this is the fallback if it is not in the cahche to go to the server and get it
//    return fetch(request).then(function(response){ return response})
//}