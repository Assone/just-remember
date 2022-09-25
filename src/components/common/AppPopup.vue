<script lang="ts" setup>
import type { Interceptor } from '@/utils/interceptor';

type Position = 'center' | 'top' | 'right' | 'bottom' | 'left';

interface AppPopupProps {
  overlay?: boolean;
  show?: boolean;
  transition?: string;
  transitionAppear?: boolean;
  position?: Position;
  closeable?: boolean;
  closeIcon?: string;
  beforeClose?: Interceptor;
  closeOnClickOverlay?: boolean;
  teleport?: string;
}

interface AppPopupEvents {
  (name: 'clickCloseIcon', evt: MouseEvent): void;
  (name: 'open'): void;
  (name: 'close'): void;
  (name: 'update:show', value: boolean): void;
  (name: 'clickOverlay', evt: MouseEvent): void;
}

const props = withDefaults(defineProps<AppPopupProps>(), {
  overlay: true,
  closeIcon: 'fluent-emoji:cross-mark',
  closeOnClickOverlay: true,
  position: 'center',
});
const emit = defineEmits<AppPopupEvents>();
const attr = useAttrs();

const transitionName = computed(() =>
  props.transition || props.position === 'center'
    ? 'app-fade'
    : `app-popup-slide-${props.position}`
);

const opened = ref(false);
const shouldReopen = ref(false);

const open = () => {
  if (!opened.value) {
    opened.value = true;

    emit('open');
  }
};

const close = () => {
  if (opened.value) {
    callInterceptor(props.beforeClose, {
      done() {
        opened.value = false;
        emit('close');
        emit('update:show', false);
      },
    });
  }
};

const onClickCloseIcon = (evt: MouseEvent) => {
  emit('clickCloseIcon', evt);
  close();
};

const onClickOverlay = (evt: MouseEvent) => {
  emit('clickOverlay', evt);

  if (props.closeOnClickOverlay) {
    close();
  }
};

watch(
  () => props.show,
  (show) => {
    if (show && !opened.value) {
      open();
    }

    if (!show && opened.value) {
      close();
    }
  }
);

onMounted(() => {
  if (props.show) {
    open();
  }
});

onActivated(() => {
  if (shouldReopen.value) {
    emit('update:show', true);
    shouldReopen.value = false;
  }
});

onDeactivated(() => {
  if (props.show && props.teleport) {
    close();
    shouldReopen.value = false;
  }
});

const positionClass: Record<Position, string> = {
  center:
    'top-1/2 left-0 right-0 w-fit max-w-[calc(100vw-16px*2)] mx-auto my-0 -translate-y-1/2',
  bottom: 'left-0 bottom-0 w-full rounded-tl-xl rounded-tr-xl',
  left: '',
  right: '',
  top: '',
};
</script>

<template>
  <AppOverlay v-if="overlay" :show="show" @click="onClickOverlay" />
  <Transition :name="transitionName" :appear="transitionAppear">
    <div
      :class="[
        'fixed max-h-full overflow-y-auto z-50 bg-white',
        'app-popup',
        positionClass[position],
      ]"
      v-show="show"
      role="dialog"
      :tabindex="0"
      v-bind="attr"
    >
      <slot />
      <AppIcon
        v-if="closeable"
        :icon="closeIcon"
        @click="onClickCloseIcon"
        role="button"
      />
    </div>
  </Transition>
</template>

<style lang="scss">
.app-popup {
  &-slide-top-enter-active,
  &-slide-left-enter-active,
  &-slide-right-enter-active,
  &-slide-bottom-enter-active {
    transition-timing-function: var(--van-ease-out);
  }

  &-slide-top-leave-active,
  &-slide-left-leave-active,
  &-slide-right-leave-active,
  &-slide-bottom-leave-active {
    transition-timing-function: var(--van-ease-in);
  }

  &-slide-top-enter-from,
  &-slide-top-leave-active {
    transform: translate3d(0, -100%, 0);
  }

  &-slide-right-enter-from,
  &-slide-right-leave-active {
    transform: translate3d(100%, -50%, 0);
  }

  &-slide-bottom-enter-from,
  &-slide-bottom-leave-active {
    transform: translate3d(0, 100%, 0);
  }

  &-slide-left-enter-from,
  &-slide-left-leave-active {
    transform: translate3d(-100%, -50%, 0);
  }
}
</style>
