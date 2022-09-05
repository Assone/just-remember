<template>
  <div class="min-h-screen">
    <div class="p-4">
      <RouterView />
    </div>
    <AppTabber>
      <AppTabbarItem>
        <i-carbon-accessibility />
        <i-mdi-account-box style="font-size: 2em; color: red" />
      </AppTabbarItem>
    </AppTabber>
  </div>
</template>
