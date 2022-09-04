<template>
  <div class="min-h-screen">
    <div class="p-4">
      <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <Transition mode="out-in">
            <KeepAlive>
              <Suspense>
                <!-- main content -->
                <component :is="Component"></component>

                <!-- loading state -->
                <template #fallback> Loading... </template>
              </Suspense>
            </KeepAlive>
          </Transition>
        </template>
      </RouterView>
    </div>
    <AppTabber>
      <AppTabbarItem />
    </AppTabber>
  </div>
</template>

<script lang="ts" setup></script>
