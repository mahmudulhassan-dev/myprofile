import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'public/widget', // Output to public folder so it's accessible
        lib: {
            entry: path.resolve(__dirname, 'src/widget/main.jsx'),
            name: 'ChatWidget',
            fileName: (format) => `chat-widget.${format}.js`,
            formats: ['umd'] // UMD for browser script tag compatibility
        },
        rollupOptions: {
            // Bundle everything (don't externalize react) for standalone usage?
            // Yes, for a widget, it's safer to bundle React if the host site doesn't have it.
            // But this increases size. For this task, we will bundle it.
            // If React is peer dependency, we'd externalize it.
            external: [],
        },
        emptyOutDir: true,
    },
    define: {
        'process.env.NODE_ENV': '"production"'
    }
});
