import { startOfMonth } from 'date-fns';
import type { Ref } from 'vue';

export const useCurrentOrders = (
  currentDate: Ref<number>,
  getDate: (date: number | Date) => Date = startOfMonth
) => {
  const orderStore = useOrder();
  const billStore = useBill();
  const currentMonth = computed(() => getDate(currentDate.value).getTime());
  const currentMonthOrders = computed(
    () =>
      billStore.month.find((data) => data.date === currentMonth.value)
        ?.orders || []
  );
  const orders = computed(() =>
    orderStore.orders.filter(({ id }) => currentMonthOrders.value.includes(id!))
  );
  const revenue = computed(() =>
    orders.value
      .filter((order) => order.price > 0)
      .reduce((pre, cur) => pre + cur.price, 0)
  );
  const expenses = computed(() =>
    orders.value
      .filter((order) => order.price < 0)
      .reduce((pre, cur) => pre + cur.price, 0)
  );

  return {
    orders,
    revenue,
    expenses,
  };
};
