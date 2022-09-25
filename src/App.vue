<script lang="ts" setup>
const route = useRoute();
const tabActive = ref(route.name);
const showTabbar = computed(
  () =>
    isString(route.name) && ['Home', 'Trends', 'Settings'].includes(route.name)
);

watchEffect(() => {
  if (tabActive.value === undefined && route.name !== undefined) {
    tabActive.value = route.name;
  }
});
</script>

<template>
  <div class="min-h-screen">
    <div class="p-4">
      <AddOrderButton />
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
