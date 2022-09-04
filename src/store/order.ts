import db from '@/model/Database';
import { useObservable } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';

export const useOrder = defineStore('order', () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const list = useObservable<Order[]>(liveQuery(() => db.order.toArray()));

  const add = async (description: string) => {
    await db.order.add({ description, category: 1, createAt: Date.now() });
  };

  return {
    list,
    add,
  };
});
