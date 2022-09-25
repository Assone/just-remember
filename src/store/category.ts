import type { Category, ID } from '@/model/Database';
import db from '@/model/Database';
import { useObservable } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';
import { from } from 'rxjs';

export const useCategory = defineStore('category', () => {
  const category = useObservable<Category[], []>(
    from(liveQuery(() => db.category.toArray()))
  );
  const categoryNameMapping = computed<Record<number, string>>(() =>
    Object.fromEntries(category.value.map(({ id, name }) => [id, name]))
  );
  const categoryIconMapping = computed<Record<number, string>>(() =>
    Object.fromEntries(category.value.map(({ id, icon }) => [id, icon]))
  );

  const createCategory = async (data: Omit<Category, 'id' | 'orders'>) => {
    await db.category.add({ ...data, orders: [] });
  };

  const deleteCategory = (id: ID) => {
    db.category.delete(id);
  };

  const updateCategory = (id: ID, data: Partial<Omit<Category, 'id'>>) => {
    db.category.update(id, data);
  };

  watchEffect(() => {
    if (category.value?.length === 0) {
      db.category.bulkAdd([
        { name: '餐饮', icon: 'fluent-emoji:bento-box', orders: [] },
        { name: '交通', icon: 'fluent-emoji:bullet-train', orders: [] },
        { name: '零食', icon: 'fluent-emoji:bubble-tea', orders: [] },
        { name: '蔬菜', icon: 'fluent-emoji:broccoli', orders: [] },
      ]);
    }
  });

  return {
    category,
    createCategory,
    deleteCategory,
    updateCategory,

    categoryNameMapping,
    categoryIconMapping,
  };
});
