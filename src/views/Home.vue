<script lang="ts" setup>
const orderStore = useOrder();
const { createOrder } = orderStore;
const { orders } = storeToRefs(orderStore);

const handleAddOrder = () => {
  createOrder({
    price: 0,
    date: 0,
    currencyId: 0,
    walletId: 1,
    categoryId: 1,
    remark: '11',
  });
};
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between">
      <div>支出</div>
      <div>收入</div>
    </div>
    <RouterLink to="/wallets">钱包</RouterLink>
    <button @click="handleAddOrder">添加账单</button>
  </div>
</template>
