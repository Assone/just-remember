<script lang="ts" setup>
const categoryStore = useCategory();
const { category } = storeToRefs(categoryStore);
</script>

<template>
  <div class="grid grid-cols-4 gap-4">
    <div
      class="flex flex-col justify-center items-center p-2 rounded-full shadow-lg"
      v-for="{ id, icon, name } in category"
      :key="id"
    >
      <AppIcon class="text-4xl" :icon="icon" />
      <span>{{ name }}</span>
    </div>
  </div>
</template>
