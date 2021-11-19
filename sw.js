importScripts('js/sw-aux.js');

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/goku.jpg',
    'img/avatars/vegeta.jpg',
    'img/avatars/broly.jpg',
    'img/avatars/gohan.jpg',
    'img/avatars/vegetto.jpg',
    'img/fondo1.jpg',
    'js/app.js'
];
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    //'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

//Instalar SW 
self.addEventListener('install', event =>{

    const cacheStatic = caches.open(STATIC_CACHE).then(cache=>
        cache.addAll(APP_SHELL)
    );

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache=>
        cache.addAll(APP_SHELL_INMUTABLE)
    );
    event.waitUntil(Promise.all([cacheStatic, cacheInmutable]));

});

//Activar SW
self.addEventListener('activate', event =>{
    
    const respuesta = caches.keys().then(keys =>{
        
        keys.forEach(key =>{

            //borrar cache dejando la ultima version

            if(key !== STATIC_CACHE && key.includes('static')){
                return caches.delete(key);
            }

            if(key !== DYNAMIC_CACHE && key.includes('dynamic')){
                return caches.delete(key);
            }

            
        });
    });
    event.waitUntil(respuesta);
});

//fetch
self.addEventListener('fetch', event =>{
    
    const respuesta = caches.match(event.request).then(res=>{        
       
        if (res) {
            
           return res;
       
        } else {
       
            console.log("el archivo solicitado no esta en cache", event.request.url);
            return fetch(event.request).then(newRes=>{
                //Llamamos funcion del archivo sw-aux.js de Guardar en cache Dinamico
                return actualizarCacheDinamico(DYNAMIC_CACHE, event.request, newRes);                
       
            });
        } //fin del else

    });
    event.respondWith(respuesta);
});