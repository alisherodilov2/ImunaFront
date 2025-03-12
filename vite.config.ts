import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { VitePWA } from 'vite-plugin-pwa';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()
    ,
  // VitePWA({
  //   registerType: 'autoUpdate',
  //   injectRegister: 'auto',
  //   manifest: {
  //     name: 'My PWA App',
  //     short_name: 'PWA App',
  //     icons: [
  //       {
  //         src: 'icon-192x192.png',
  //         sizes: '192x192',
  //         type: 'image/png',
  //       },
  //     ],
  //   },
  // }),
  ],
  server: {
    host: '0.0.0.0', // Barcha tarmoq ulanishlarini qabul qiladi
    port: 5050,
    open: true, // Brauzerni avtomatik ochadi
  },
})
