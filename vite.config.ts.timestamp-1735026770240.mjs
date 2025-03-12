// vite.config.ts
import { defineConfig } from "file:///E:/2024-loyiha/medplus/U-men_front/node_modules/vite/dist/node/index.js";
import react from "file:///E:/2024-loyiha/medplus/U-men_front/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    react()
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
    host: "0.0.0.0",
    // Barcha tarmoq ulanishlarini qabul qiladi
    port: 5050,
    open: true
    // Brauzerni avtomatik ochadi
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFwyMDI0LWxveWloYVxcXFxtZWRwbHVzXFxcXFUtbWVuX2Zyb250XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFwyMDI0LWxveWloYVxcXFxtZWRwbHVzXFxcXFUtbWVuX2Zyb250XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi8yMDI0LWxveWloYS9tZWRwbHVzL1UtbWVuX2Zyb250L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG4vLyBpbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJztcclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbcmVhY3QoKVxyXG4gICAgLFxyXG4gIC8vIFZpdGVQV0Eoe1xyXG4gIC8vICAgcmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXHJcbiAgLy8gICBpbmplY3RSZWdpc3RlcjogJ2F1dG8nLFxyXG4gIC8vICAgbWFuaWZlc3Q6IHtcclxuICAvLyAgICAgbmFtZTogJ015IFBXQSBBcHAnLFxyXG4gIC8vICAgICBzaG9ydF9uYW1lOiAnUFdBIEFwcCcsXHJcbiAgLy8gICAgIGljb25zOiBbXHJcbiAgLy8gICAgICAge1xyXG4gIC8vICAgICAgICAgc3JjOiAnaWNvbi0xOTJ4MTkyLnBuZycsXHJcbiAgLy8gICAgICAgICBzaXplczogJzE5MngxOTInLFxyXG4gIC8vICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXHJcbiAgLy8gICAgICAgfSxcclxuICAvLyAgICAgXSxcclxuICAvLyAgIH0sXHJcbiAgLy8gfSksXHJcbiAgXSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIGhvc3Q6ICcwLjAuMC4wJywgLy8gQmFyY2hhIHRhcm1vcSB1bGFuaXNobGFyaW5pIHFhYnVsIHFpbGFkaVxyXG4gICAgcG9ydDogNTA1MCxcclxuICAgIG9wZW46IHRydWUsIC8vIEJyYXV6ZXJuaSBhdnRvbWF0aWsgb2NoYWRpXHJcbiAgfSxcclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnUyxTQUFTLG9CQUFvQjtBQUM3VCxPQUFPLFdBQVc7QUFHbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQUMsTUFBTTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBaUJoQjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUE7QUFBQSxFQUNSO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
