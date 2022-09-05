import type { PropType } from 'vue';
import type { RouteLocationRaw } from 'vue-router';
import AppIcon from './AppIcon.vue';
import { AppTabbarProvideKey } from './AppTabber';

export interface AppTabbarItemProps {
  name?: string | number;
}

export default defineComponent({
  name: 'AppTabbarItem',
  props: {
    name: {
      type: [String, Number],
    },
    icon: String,
    to: {
      type: [String, Object] as PropType<RouteLocationRaw>,
    },
    replace: Boolean,
  },
  emits: ['click'],
  setup(props, { emit }) {
    const slots = useSlots();
    const route = useRoute();
    const { name } = toRefs(props);
    const { index, parent } = useParent(AppTabbarProvideKey);

    if (!parent) {
      return undefined;
    }

    const active = computed(() => {
      const { route: enabledRoute, modelValue } = parent.props;

      if (enabledRoute) {
        const { to } = props;
        const config = isObject(to) ? to : { path: to };

        return !!route.matched.find((val) => {
          const pathMatched = 'path' in config && config.path === val.path;
          const nameMatched = 'name' in config && config.name === val.name;

          return pathMatched || nameMatched;
        });
      }

      return (name.value ?? index.value) === modelValue;
    });

    const onClick = (event: MouseEvent) => {
      if (!active.value) {
        // ???
        parent.setActive(props.name ?? index.value, noop);
      }

      emit('click', event);
    };

    const renderIcon = () => {
      if (slots.icon) {
        return slots.icon({ active: active.value });
      }

      if (props.icon) {
        return <AppIcon icon={props.icon} />;
      }

      return null;
    };

    return () => {
      const { activeColor, inactiveColor } = parent.props;
      const color = active.value ? activeColor : inactiveColor;

      return (
        <div
          class={[
            'flex flex-1 flex-col justify-center items-center gap-1 text-xs leading-none cursor-pointer',
            active.value ? 'text-red-400' : '',
          ]}
          role="tab"
          aria-selected={active.value}
          tabindex={0}
          style={{ color }}
          onClick={onClick}
        >
          <div class="relative inline-block text-2xl leading-[0]">
            {renderIcon()}
          </div>
          <div>{slots?.default?.({ active: active.value })}</div>
        </div>
      );
    };
  },
});
