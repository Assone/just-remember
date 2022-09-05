<script lang="ts" setup>
const tabActive = ref(0);
</script>

<template>
  <div class="min-h-screen">
    <div class="p-4">
      <RouterView />
    </div>
    <AppTabber v-model="tabActive">
      <AppTabbarItem icon="fluent-emoji:houses"> 首页 </AppTabbarItem>
      <AppTabbarItem icon="fluent-emoji:bar-chart"> 趋势 </AppTabbarItem>
      <AppTabbarItem icon="fluent-emoji:gear"> 设置 </AppTabbarItem>
    </AppTabber>
  </div>
</template>
