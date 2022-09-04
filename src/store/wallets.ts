import db, { type Wallets } from '@/model/Database';
import { useObservable } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';

export const useWallets = defineStore('wallets', () => {
  const wallets = useObservable<Wallets[]>(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    liveQuery(() => db.wallets.toArray())
  );
  const totalAssets = computed(() =>
    wallets.value?.reduce((pre, { balance }) => pre + balance, 0)
  );
  const totalLiabilities = computed(() =>
    wallets.value
      ?.filter((wallet) => wallet.balance < 0)
      .reduce((pre, cur) => pre + cur.balance, 0)
  );

  const addWallets = (name: string, balance: number) => {
    db.wallets.add({
      name,
      balance,
      orders: [],
    });
  };

  watchEffect(() => {
    if (wallets.value?.length === 0) {
      db.wallets.add({
        name: '默认钱包',
        balance: 0,
        orders: [],
      });
    }
  });

  return {
    wallets,
    totalAssets,
    totalLiabilities,

    addWallets,
  };
});
