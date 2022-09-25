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
        { name: '礼物', icon: 'fluent-emoji:wrapped-gift', orders: [] },
        { name: '日用品', icon: 'fluent-emoji:roll-of-paper', orders: [] },
        { name: '住房', icon: 'fluent-emoji:house', orders: [] },
        { name: '宠物', icon: 'fluent-emoji:teddy-bear', orders: [] },
        { name: '医疗', icon: 'fluent-emoji:hospital', orders: [] },
        { name: '快递', icon: 'fluent-emoji:package', orders: [] },
        { name: '购物', icon: 'fluent-emoji:coin', orders: [] },
        { name: 'App订阅', icon: 'fluent-emoji:mobile-phone', orders: [] },
        { name: '游戏', icon: 'fluent-emoji:joystick', orders: [] },
        { name: '水果', icon: 'fluent-emoji:kiwi-fruit', orders: [] },
        { name: '娱乐', icon: 'fluent-emoji:party-popper', orders: [] },
        { name: '书籍', icon: 'fluent-emoji:books', orders: [] },
        { name: '酒店', icon: 'fluent-emoji:department-store', orders: [] },
        { name: '生活', icon: 'fluent-emoji:glowing-star', orders: [] },
        { name: '服饰', icon: 'fluent-emoji:jeans', orders: [] },
        { name: '其他', icon: '', orders: [] },
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
