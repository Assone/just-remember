<script lang="ts" setup>
const router = useRouter();
const { category } = storeToRefs(useCategory());

const toWallets = () => {
  router.push({ name: 'Wallets' });
};
</script>

<template>
  <div class="flex flex-col gap-4">
    <div @click="toWallets">钱包</div>
    <div class="flex justify-between">
      <div>支出</div>
      <div>收入</div>
    </div>
    <div>
      <OrderList />
    </div>
  </div>
</template>
