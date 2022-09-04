<script lang="ts" setup>
const router = useRouter();

const toOrderDetail = (id: string) => {
  router.push({ name: 'OrderDetail', params: { id } });
};
</script>

<template>
  <div class="border rounded-2xl bg-red-500">
    <div
      class="flex justify-between items-center p-4 border-b last:border-0"
      v-for="i in 5"
      :key="i"
      @click="() => toOrderDetail('1')"
    >
      <div class="flex gap-2 justify-center items-center">
        <span>😀</span>
        <div>
          <span>零食</span>
          <span>-</span>
          <span>18:30</span>
        </div>
      </div>
      <div class="flex flex-col text-right">
        <span>-22</span>
        <span>中国银行</span>
      </div>
    </div>
  </div>
</template>
