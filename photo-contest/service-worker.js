import toast from "react-hot-toast";
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';

self.skipWaiting();
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST || []);
// public/sw.js
self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  toast.success("Service Worker installing");
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating.');
  toast.success("Service Worker activating.");
  clients.claim();
});
