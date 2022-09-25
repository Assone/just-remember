<script lang="ts" setup>
interface CardProps {
  title: string;
  value: string | number;
}

defineProps<CardProps>();
</script>

<template>
  <div class="p-4 text-center rounded shadow-md">
    <div>{{ title }}</div>
    <div>{{ value }}</div>
  </div>
</template>
