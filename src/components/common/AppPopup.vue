<script lang="ts" setup>
import type { Interceptor } from '@/utils/interceptor';

interface AppPopupProps {
  overlay?: boolean;
  show?: boolean;
  transition?: string;
  transitionAppear?: boolean;
  position?: 'center';
  closeable?: boolean;
  closeIcon?: string;
  beforeClose?: Interceptor;
}

interface AppPopupEvents {
  (name: 'clickCloseIcon', evt: MouseEvent): void;
  (name: 'open'): void;
  (name: 'close'): void;
  (name: 'update:show', value: boolean): void;
}

const props = withDefaults(defineProps<AppPopupProps>(), {
  overlay: true,
  closeIcon: 'fluent-emoji:cross-mark',
  closeable: true,
});
const emit = defineEmits<AppPopupEvents>();
const attr = useAttrs();

const transitionName = computed(() =>
  props.transition || props.position === 'center'
    ? 'app-fade'
    : `app-popup-slide-${props.position}`
);
const opened = ref(false);

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
</script>

<template>
  <AppOverlay v-if="overlay" :show="show" />
  <Transition :name="transitionName" :appear="transitionAppear">
    <div v-show="show" role="dialog" :tabindex="0" v-bind="attr">
      <slot />
      <AppIcon v-if="closeable" :icon="closeIcon" @click="onClickCloseIcon" />
    </div>
  </Transition>
</template>
