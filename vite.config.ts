import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      customElement: ['iconify-icon'],
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ['iconify-icon'].includes(tag),
        },
      },
    }),
    vueJsx(),
    Icons({
      autoInstall: true,
    }),
    AutoImport({
      dts: './src/types/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
      },
      imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
      dirs: ['./src/hooks/**', './src/store', './src/utils'],
    }),
    Components({
      resolvers: [IconsResolver()],
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
