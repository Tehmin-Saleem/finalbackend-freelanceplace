import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  optimizeDeps: {
    include: ['@stripe/react-stripe-js', 'pdf-lib']
  },
  plugins: [react()],
  proxy: {
    '/api': {
      target: 'http://13.61.176.80:5000',
      changeOrigin: true,
      secure: false,
    },
  },
  build: {
    rollupOptions: {
      external: ['pdfjs-dist/build/pdf.worker.entry']
    }
  },
  resolve: {
    alias: {
      'pdfjs-dist/build/pdf.worker.entry': 'pdfjs-dist/build/pdf.worker.min.js'
    }
  }

  
});



// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import legacy from '@vitejs/plugin-legacy';

// export default defineConfig({
//   plugins: [
//     react(),
//     legacy({
//       targets: ['defaults', 'not IE 11']
//     })
//   ]
// });
