import type {
  ComponentInternalInstance,
  ComponentPublicInstance,
  InjectionKey,
} from 'vue';

type ParentProvide<T> = T & {
  link(child: ComponentInternalInstance): void;
  unlink(child: ComponentInternalInstance): void;
  children: ComponentPublicInstance[];
  internalChildren: ComponentInternalInstance[];
};

export const useChildren = <
  Children extends ComponentPublicInstance = ComponentPublicInstance<
    any,
    unknown
  >,
  ParentProvideValue = never
>(
  key: InjectionKey<ParentProvideValue>
) => {
  const children: Children[] = reactive([]);
  const internalChildren: ComponentInternalInstance[] = reactive([]);
  const instance = getCurrentInstance();

  const linkChildren = (value?: ParentProvideValue) => {
    const link = (child: ComponentInternalInstance) => {
      if (child.proxy) {
        internalChildren.push(child);
        children.push(child.proxy as Children);
      }
    };

    const unlink = (child: ComponentInternalInstance) => {
      const index = internalChildren.indexOf(child);
      children.splice(index, 1);
      internalChildren.splice(index, 1);
    };

    provide(key, {
      children,
      internalChildren,
      link,
      unlink,
      ...value,
    });
  };

  return {
    linkChildren,
    children,
  };
};

export const useParent = <T>(key: InjectionKey<ParentProvide<T>>) => {
  const parent = inject(key, null);

  if (parent) {
    const instance = getCurrentInstance()!;
    const { link, unlink, internalChildren } = parent;

    link(instance);
    onUnmounted(() => unlink(instance));

    const index = computed(() => internalChildren.indexOf(instance));

    return {
      parent,
      index,
    };
  }

  return {
    parent: null,
    index: ref(-1),
  };
};
