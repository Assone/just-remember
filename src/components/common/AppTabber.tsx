import type { Interceptor } from '@/utils/interceptor';
import type { Component, InjectionKey, PropType } from 'vue';

export interface AppTabbarProps {
  fixed?: boolean;
  border?: boolean;
  modelValue?: string | number;
  route?: boolean;
  activeColor?: string;
  inactiveColor?: string;
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
    modelValue: {
      type: [String, Number],
      default: 0,
    },
    route: Boolean,
    activeColor: String,
    inactiveColor: String,
    beforeChange: Function as PropType<Interceptor>,
  },
  emits: ['change', 'update:modelValue'],
  setup(props, { emit }) {
    const slots = useSlots();
    const { linkChildren } = useChildren(AppTabbarProvideKey);
    const { border, fixed } = toRefs(props);

    const setActive = (active: number | string, afterChange: () => void) => {
      callInterceptor(props.beforeChange, {
        args: [active],
        done() {
          emit('update:modelValue', active);
          emit('change', active);
          afterChange();
        },
      });
    };

    linkChildren({ props, setActive });

    const renderSlot = () => {
      const children = slots?.default?.();

      return children?.filter(
        (vnode) => (vnode.type as Component)?.name === 'AppTabbarItem'
      );
    };

    return () => (
      <div
        role="tablist"
        class={[
          fixed.value ? 'fixed bottom-0 left-0' : '',
          border.value ? 'border' : '',
          'flex w-full h-14 bg-white/75 backdrop-blur',
        ]}
      >
        {renderSlot()}
      </div>
    );
  },
});
