//Enable or Disable the cache
var doCache = true;

//Name of cache
var CACHE_NAME = 'my-cache-v1';

//Delete old caches
self.addEventListener("activate", event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        cache.keys()
            .then(keyList =>
             Promise.all(keyList.map(key =>{
                 if (!cacheWhitelist.includes(key)){
                     console.log('Deleting cache: ' + key)
                     return caches.delete(key);
                 }
             })))
    );
});

//If new client an install is triggered
self.addEventListener('install', function(event){
    if(doCache){
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(function(cache){
                    fetch("asset-manifest.json")
                        .then(response => {
                            response.json()
                        })
                        .then(assets => {
                            //Open a new cache and use immediately
                            //Cache current page and main.js file
                            const urlsToCache = [
                                "/",
                                assets["main.js"]
                            ]
                            cache.addAll(urlsToCache)
                            console.log('cached');
                        })
                })
        );
    }
});

// When the webpage goes to fetch files, request is intercepted
//Request is handled first by cache to improve speeds
self.addEventListener('fetch', function(event){
    if(doCache){
        event.respondWith(
            cache.match(event.request).then(function(response){
                return response || fetch(event.request);
            })
        );
    }
});