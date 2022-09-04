import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      dts: './src/types/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
      },
      imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
      dirs: ['./src/hooks/**', './src/store'],
    }),
    Components({
      dirs: ['src/components/**'],
      dts: './src/types/auto-components.d.ts',
      types: [
        {
          from: 'vue-router',
          names: ['RouterLink', 'RouterView'],
        },
        {
          from: 'vue',
          names: ['Suspense', 'Teleport', 'Transition', 'TransitionGroup'],
        },
      ],
      extensions: ['vue', 'tsx'],
      include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
    }),
  ],
  resolve: {
    alias: [{ find: /^@\/(.*)/, replacement: '/src/$1' }],
  },
});
