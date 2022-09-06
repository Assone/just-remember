import type { ID, Order } from '@/model/Database';
import db from '@/model/Database';
import { useObservable } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';
import { from, map } from 'rxjs';

export const useOrder = defineStore('order', () => {
  const category = useCategory();
  const wallet = useWallet();
  const bill = useBill();
  const { categoryNameMapping } = storeToRefs(category);
  const { walletNameMapping } = storeToRefs(wallet);

  const order = useObservable(
    from(liveQuery(() => db.order.toArray())).pipe(
      map((list) =>
        list.map((data) => ({
          ...data,
          category: categoryNameMapping.value[data.categoryId],
          wallet: walletNameMapping.value[data.walletId],
        }))
      )
    ),
    { initialValue: [] }
  );

  const createOrder = async (data: Omit<Order, 'createAt'>) => {
    db.transaction(
      'rw',
      [
        db.order,
        db.billDay,
        db.billWeek,
        db.billMonth,
        db.billQuarter,
        db.billYear,
      ],
      async () => {
        const id = await db.order.add({
          ...data,
          createAt: Date.now(),
        });

        await bill.addOrderToBill(id as number, data.date);
      }
    );
  };

  const deleteOrder = (id: ID) => {
    db.transaction(
      'rw',
      [
        db.order,
        db.billDay,
        db.billWeek,
        db.billMonth,
        db.billQuarter,
        db.billYear,
      ],
      async () => {
        await Promise.all([db.order.delete(id), bill.delOrderToBill(id)]);
      }
    );
  };

  const updateOrder = (
    id: ID,
    data: Partial<Omit<Order, 'createAt' | 'updateAt'>>
  ) => {
    db.order.update(id, data);
  };

  return {
    orders: order,

    createOrder,
    deleteOrder,
    updateOrder,
  };
});
