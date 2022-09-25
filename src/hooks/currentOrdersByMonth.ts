import { startOfMonth } from 'date-fns';
import type { Ref } from 'vue';

export const useCurrentOrdersByMonth = (currentDate: Ref<number>) => {
  const orderStore = useOrder();
  const billStore = useBill();
  const currentMonth = computed(() =>
    startOfMonth(currentDate.value).getTime()
  );
  const currentMonthOrders = computed(
    () =>
      billStore.month.find((data) => data.date === currentMonth.value)
        ?.orders || []
  );
  const orders = computed(() =>
    orderStore.orders.filter(({ id }) => currentMonthOrders.value.includes(id!))
  );

  return orders;
};
