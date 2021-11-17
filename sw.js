importScripts('js/sw-aux.js');

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [    
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/broly.jpg',
    'img/avatars/gohan.jpg',
    'img/avatars/goku.jpg',        
    'img/avatars/vegeta.jpg',
    'img/avatars/vegetto.jpg',
    'img/fondo1.jpg',
    'js/app.js',
    'js/sw-aux.js'
];

const APP_SHELL_INMUTABLE = [ //busqueda en internet
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    // 'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

self.addEventListener('install', e=>{

    const cacheStatic = caches.open(STATIC_CACHE).then(cache=>
        cache.addAll(APP_SHELL));

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache=>
        cache.addAll(APP_SHELL_INMUTABLE));    

    // e.waitUntil(Promise.add([cacheStatic, cacheInmutable]));
    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));    

});

self.addEventListener('activate', e=>{

    //metodo para eliminar caches viejos
    const respuesta = caches.keys().then( keys => {
        keys.forEach( key =>{
            if( key !== STATIC_CACHE && key.includes('static')){
                return caches.delete(key);
            }
        })
    })
    e.waitUntil(respuesta);
});

self.addEventListener ('fetch', e=>{
   const respuesta = caches.match(e.request).then(res =>{
        if(res){
            return res;
        }            
        else{
            console.log(e.request.url);
            return fetch(e.request).then(newRes=>{//nos vamos a internet            
                return actualizarCacheDinamico(DYNAMIC_CACHE, e.request, newRes) ;
                //almacenamos en cache dinamico
            });                        
        }
    });
    //mostramos el recurso con la constante
    e.respondWith(respuesta);    
});