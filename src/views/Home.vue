<script lang="ts" setup>
import { useCurrentOrders } from '@/hooks/currentOrders';

const orderStore = useOrder();

const currentDate = ref(Date.now());
const { orders, revenue, expenses } = useCurrentOrders(currentDate);

const handleAddOrder = () => {
  orderStore.createOrder({
    price: -Math.floor(Math.random() * 100),
    date: Date.now(),
    currencyId: 0,
    walletId: 1,
    categoryId: 3,
    remark: '11',
  });
};
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between gap-4">
      <Card class="flex-1 bg-slate-300" title="支出" :value="revenue" />
      <Card class="flex-1 bg-slate-300" title="收入" :value="expenses" />
    </div>
    <RouterLink to="/wallets">钱包</RouterLink>
    <button @click="handleAddOrder">添加账单</button>
    <div class="flex flex-col gap-2">
      <div
        v-for="{ id, wallet, category, price, categoryIcon, time } in orders"
        :key="id"
        class="flex justify-between items-center bg-slate-300 p-2 rounded"
      >
        <div class="flex items-center gap-2">
          <AppIcon class="text-4xl" :icon="categoryIcon" />
          <span>{{ category }}</span>
          <span>{{ time }}</span>
        </div>
        <div class="flex flex-col text-right">
          <span>{{ price }}</span>
          <span>{{ wallet }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
