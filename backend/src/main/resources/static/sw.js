//This is the "Offline copy of pages" service worker

self.addEventListener('install', function (event) {
    event.waitUntil(self.skipWaiting());
});

//If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener('fetch', function (event) {
    var isCachingAllowed = function(request){
        let isHttpGet = request.method === "GET";
        // "login"  one has something to do with the way the 2 auth back and forth works
        // if we don't check for this every page asks for google credentials

        let cacheDisabledUrls = ["/api/", "/login", "/sw.js", "registerSw.js"];

        let isCacheDisabledUrl = cacheDisabledUrls.some( function(cacheDisabledUrl){
            return request.url.indexOf(cacheDisabledUrl) !== -1;
        });

        return !isCacheDisabledUrl
    }

    var updateCache = function (request) {
        if(!isCachingAllowed(request)) return;

        return caches.open('mindmap').then(function (cache) {
            return fetch(request).then(function (response) {

                console.log('[PWA Builder] add page to offline' + response.url)
                return cache.put(request, response);

            });
        });
    };

    event.waitUntil(updateCache(event.request));

    event.respondWith(
        fetch(event.request).catch(function (error) {
            console.log('[PWA Builder] Network request Failed. Serving content from cache: ' + error);

            //Check to see if you have it in the cache
            //Return response
            //If not in the cache, then return error page
            return caches.open('mindmap').then(function (cache) {
                return cache.match(event.request)
                    .then(function (matching) {
                        var report = !matching || matching.status == 404 ? Promise.reject('no-match') : matching;
                        return report
                    })
                    .catch(error => {
                        console.warn("Url not in cache or available on network: " + event.request.url);
                    });
            });
        })
    );
})
