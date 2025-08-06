const CACHE_NAME = 'percy-jackson-directory-cache-v2'; // Increment version for new caches
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/images/pjo-icon-192.png', /* Make sure these image paths are correct! */
    '/images/pjo-icon-512.png', /* Make sure these image paths are correct! */
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Open+Sans:wght@400;700&display=swap',
    'https://fonts.gstatic.com/s/cinzel/v18/8gXJ7xM0_x_E9_cj-h_Q.woff2', // Specific font files
    'https://fonts.gstatic.com/s/opensans/v34/memvYaGs126MiZpBA-Dfwg.woff2', // Specific font files
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Trident_icon.svg/128px-Trident_icon.svg.png', /* External images */
    'https://placehold.co/1200x800/2c3e50/f4f4f4?text=Mount+Olympus+Above+Empire+State+Building', // Registration background
    'https://riordan.fandom.com/wiki/Camp_Half-Blood?file=CampHalf-BloodArch.png', // Camp Map image
    // Godly parent quiz result images
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Jupiter_and_Thetis_by_Jean_Auguste_Dominique_Ingres.jpg/330px-Jupiter_and_Thetis_by_Jean_Auguste_Dominique_Ingres.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Hera_%28Persephone%29_by_Albrecht_D%C3%BCrer.png/330px-Hera_%28Persephone%29_by_Albrecht_D%C3%BCrer.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Statue-Zeus-Poseidon.jpg/330px-Statue-Zeus-Poseidon.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Goddess_Demeter_Roman_Era_Istanbul_Archaeological_Museums.jpg/330px-Goddess_Demeter_Roman_Era_Istanbul_Archaeological_Museums.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Pallas_Athena_%28Gustav_Klimt%29.jpg/330px-Pallas_Athena_%28Gustav_Klimt%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Apollo-sculpture_Musei_Vaticani.jpg/330px-Apollo_sculpture_Musei_Vaticani.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Artemis_Versailles_MR_218.jpg/330px-Artemis_Versailles_MR_218.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Ares_Borghese_Louvre_MR302.jpg/330px-Ares_Borghese_Louvre_Ma302.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Aphrodite_of_Knidos_Altemps.jpg/330px-Aphrodite_of_Knidos_Altemps.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Hephaestus_Louvre_Ma312.jpg/330px-Hephaestus_Louvre_Ma312.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Hermes_Belvedere_pushkin_museum.jpg/330px-Hermes_Belvedere_pushkin_museum.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Dionysos_Liebieghaus_202.jpg/330px-Dionysos_Liebieghaus_202.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Hades_Altemps.jpg/330px-Hades_Altemps.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Question_mark_symbol.png/1200px-Question_mark_symbol.png',
    // Arena monster images
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Minotaur_by_George_Frederic_Watts.jpg/330px-Minotaur_by_George_Frederic_Watts.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Hydra_by_Gustave_Moreau.jpg/330px-Hydra_by_Gustave_Moreau.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Caravaggio_-_Medusa.jpg/330px-Caravaggio_-_Medusa.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Cyclops_by_Odilon_Redon.jpg/330px-Cyclops_by_Odilon_Redon.jpg'
];

// Install event: caches the listed resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                // Adding all URLs to cache. If any fail, the whole install fails.
                return cache.addAll(urlsToCache).catch(error => {
                    console.error('Failed to cache:', error);
                    // Log which URL failed to cache
                    urlsToCache.forEach(url => {
                        caches.match(url).then(response => {
                            if (!response) {
                                console.warn('URL not cached:', url);
                            }
                        });
                    });
                });
            })
            .then(() => self.skipWaiting()) // Activates the service worker immediately
    );
});

// Activate event: cleans up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => self.clients.claim()) // Makes the new service worker control current open pages
    );
});

// Fetch event: serves cached content or fetches from network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // No cache hit - fetch from network
                return fetch(event.request).then(
                    fetchResponse => {
                        // Check if we received a valid response
                        if(!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                            return fetchResponse;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and can only be consumed once. We consume it once to cache it,
                        // and once the browser consumes it.
                        const responseToCache = fetchResponse.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return fetchResponse;
                    }
                ).catch(error => {
                    // This catch is for network errors only.
                    console.error('Fetching failed:', error);
                    // You can return a fallback page here for offline experience if specific resource fails
                    // e.g., return caches.match('/offline.html');
                });
            })
    );
});
