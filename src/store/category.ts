import { liveQuery } from 'dexie';
import { useObservable } from '@vueuse/rxjs';
import db from '@/model/Database';
import type { Category } from '@/model/Database';

export const useCategory = defineStore('category', () => {
  const category = useObservable<Category[]>(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    liveQuery(() => db.category.toArray())
  );

  const addCategory = async (categoryName: string, icon: string) => {
    await db.category.add({ name: categoryName, icon, orders: [] });
  };

  watchEffect(() => {
    if (category.value?.length === 0) {
      db.category.bulkAdd([
        { name: '餐饮', icon: '☕️', orders: [] },
        { name: '交通', icon: '�‍♀️�', orders: [] },
        { name: '通讯', icon: '��', orders: [] },
        { name: '零食', icon: '〇', orders: [] },
        { name: '蔬菜', icon: '��', orders: [] },
        { name: '烟酒', icon: '��', orders: [] },
        { name: '日用品', icon: '��', orders: [] },
        { name: '礼品', icon: '��', orders: [] },
      ]);
    }
  });

  return {
    category,
    addCategory,
  };
});
