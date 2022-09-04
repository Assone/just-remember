import type { InjectionKey } from 'vue';
import { defineEmits } from 'vue';

// {
/* <script lang="ts" setup>
import {
  type AppTabbarProps,
  type AppTabbarEvent,
  AppTabbarProvideKey,
} from './useTabbar';

const props = withDefaults(defineProps<AppTabbarProps>(), {
  fixed: true,
  border: true,
});
const emit = defineEmits<AppTabbarEvent>();
const { linkChildren } = useChildren(AppTabbarProvideKey);

const setActive = (active: number | string) => {
  console.log('setActive', active);
};

linkChildren({ props, setActive });
</script>

<template>
  <div
    :class="[fixed ? 'fixed bottom-0' : '', border ? 'border' : '', 'w-full']"
  >
    <slot />
  </div>
</template> */
// }

export interface AppTabbarProps {
  fixed?: boolean;
  border?: boolean;
}

export interface AppTabbarEvent {
  (name: 'change'): void;
  (name: 'update:modelValue'): void;
}

export interface AppTabbarProvide {
  props: AppTabbarProps;
  setActive: (active: number | string, afterChange: () => void) => void;
}

export const AppTabbarProvideKey: InjectionKey<AppTabbarProvide> =
  Symbol('tabbar');

export default defineComponent({
  name: 'AppTabbar',
  props: {
    fixed: {
      type: Boolean,
      default: true,
    },
    border: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['change', 'update:modelValue'],
  setup(props, ctx) {
    const slot = useSlots();
    const { linkChildren } = useChildren(AppTabbarProvideKey);
    const { border, fixed } = toRefs(props);

    const setActive = (active: number | string) => {
      console.log('setActive', active);
    };

    linkChildren({ props, setActive });

    return () => (
      <div
        class={[
          fixed.value ? 'fixed bottom-0' : '',
          border.value ? 'border' : '',
          'w-full',
        ]}
      >
        {slot?.default?.()}
      </div>
    );
  },
});
