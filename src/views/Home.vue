<script lang="ts" setup>
import { RouterLink } from 'vue-router';

const store = useOrder();
const category = useCategory();
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between">
      <div>支出</div>
      <div>收入</div>
    </div>
    <RouterLink to="/wallets">钱包</RouterLink>
  </div>
</template>
