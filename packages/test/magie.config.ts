import { defineConfig } from 'magie';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    define: {
        __LLL__: '"LLL"'
    }
});