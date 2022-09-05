import type { PropType } from 'vue';
import type { RouteLocationPathRaw, RouteLocationRaw } from 'vue-router';
import { AppTabbarProvideKey } from './AppTabber';

interface AppTabbarItemProps {
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
      return;
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
        parent.setActive(props.name ?? index.value, route);
      }

      emit('click', event);
    };

    // eslint-disable-next-line consistent-return
    return () => {
      const { activeColor, inactiveColor } = parent.props;
      const color = active.value ? activeColor : inactiveColor;

      return (
        <div
          role="tab"
          aria-selected={active.value}
          tabindex={0}
          style={{ color }}
          onClick={onClick}
        >
          <div>{slots?.default?.({ active: active.value })}</div>
        </div>
      );
    };
  },
});
