<script lang="ts" setup>
const route = useRoute();
const tabActive = ref(route.name);
const showTabbar = computed(
  () =>
    isString(route.name) && ['Home', 'Trends', 'Settings'].includes(route.name)
);
const showAddOrderView = ref(false);

watchEffect(() => {
  if (tabActive.value === undefined && route.name !== undefined) {
    tabActive.value = route.name;
  }
});
</script>

<template>
  <div class="min-h-screen">
    <div class="p-4">
      <AppIcon icon="fluent-emoji:plus" @click="showAddOrderView = true" />
      <AppPopup v-model:show="showAddOrderView">
        <div>12312</div>
      </AppPopup>
      <RouterView />
    </div>
    <AppTabber v-show="showTabbar" v-model="tabActive" router>
      <AppTabbarItem icon="fluent-emoji:receipt" name="Home" to="/">
        明细
      </AppTabbarItem>
      <AppTabbarItem icon="fluent-emoji:bar-chart" name="Trends" to="/trends">
        趋势
      </AppTabbarItem>
      <AppTabbarItem icon="fluent-emoji:gear" name="Settings" to="/settings">
        设置
      </AppTabbarItem>
    </AppTabber>
  </div>
</template>
