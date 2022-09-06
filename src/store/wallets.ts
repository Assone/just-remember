import type { ID, Wallet } from '@/model/Database';
import db from '@/model/Database';
import { useObservable } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';
import { from } from 'rxjs';

export const useWallet = defineStore('wallets', () => {
  const wallet = useObservable(from(liveQuery(() => db.wallet.toArray())), {
    initialValue: [] as Wallet[],
  });
  const walletNameMapping = computed<Record<number, string>>(() =>
    Object.fromEntries(wallet.value.map(({ id, name }) => [id, name]))
  );

  const totalAssets = computed(() =>
    wallet.value.reduce((pre, { balance }) => pre + balance, 0)
  );
  const totalLiabilities = computed(() =>
    wallet.value
      .filter(({ balance }) => balance < 0)
      .reduce((pre, cur) => pre + cur.balance, 0)
  );

  const createWallet = (data: Omit<Wallet, 'id' | 'orders'>) => {
    db.wallet.add({
      ...data,
      orders: [],
    });
  };

  const updateWallet = (id: ID, data: Partial<Omit<Wallet, 'id'>>) => {
    db.wallet.update(id, data);
  };

  const deleteWallet = (id: ID) => {
    db.wallet.delete(id);
  };

  onMounted(async () => {
    const count = await db.wallet.count();

    if (count === 0) {
      db.wallet.add({
        name: '默认钱包',
        balance: 0,
        orders: [],
      });
    }
  });

  return {
    wallet,
    walletNameMapping,
    totalAssets,
    totalLiabilities,

    createWallet,
    updateWallet,
    deleteWallet,
  };
});
