<script lang="ts" setup>
interface AppOverlayProps {
  show?: boolean;
}

const props = defineProps<AppOverlayProps>();
</script>

<template>
  <Transition name="app-fade" appear>
    <div
      v-show="show"
      class="fixed top-0 left-0 w-full h-full bg-black/70 z-10"
    >
      <slot />
    </div>
  </Transition>
</template>
