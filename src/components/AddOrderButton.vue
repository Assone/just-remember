<script lang="ts" setup>
const show = ref(false);
</script>

<template>
  <AppIcon icon="fluent-emoji:plus" @click="show = true" />
  <AppPopup v-model:show="show" position="bottom">
    <div class="p-4">
      <CategoryList />
    </div>
  </AppPopup>
</template>
