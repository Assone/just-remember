<script lang="ts" setup>
const store = useWallets();
const { wallets, totalAssets, totalLiabilities } = storeToRefs(store);

const name = ref('');
const balance = ref(0);

const addWallets = () => {
  store.addWallets(name.value, balance.value);
  name.value = '';
  balance.value = 0;
};
</script>

<template>
  <div>
    <h1>钱包</h1>
    <div>
      <div>总资产：{{ totalAssets }}</div>
      <div>总负债: {{ totalLiabilities }}</div>
    </div>
    <div>
      <div>
        <span>钱包名字:</span>
        <input v-model="name" />
      </div>
      <div>
        <span>初始余额:</span>
        <input v-model.number="balance" />
      </div>
      <button @click="addWallets">添加钱包</button>
    </div>
    <div class="flex flex-col gap-4">
      <div
        class="flex justify-between items-center p-4 rounded bg-slate-500 text-white"
        v-for="{ id, name, balance } in wallets"
        :key="id"
      >
        <div>{{ name }}</div>
        <div class="flex flex-col text-right">
          <span>余额</span>
          <span>{{ balance }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
