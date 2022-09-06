import Dexie, { type Table } from 'dexie';

type ID = number;

interface Order {
  id?: ID;
  price: number;
  remark?: string;
  date: number;
  createAt: number;
  updateAt?: number;
  currencyId: ID;
  walletId: ID;
  categoryId: ID;
}
interface Subscribe {
  id?: ID;
}
interface Staging {
  id?: ID;
}
interface Currency {
  id?: ID;
  name: string;
  symbol: string;
}
interface Budget {
  id?: ID;
}
interface BudgetCategory {
  id?: ID;
}
interface Category {
  id?: ID;
  name: string;
  icon: string;
  orders: ID[];
}
interface Wallet {
  id?: ID;
  name: string;
  remark?: string;
  balance: number;
  orders: ID[];
}
interface BillDay {
  id?: ID;
  date: number;
  orders: ID[];
}
interface BillWeek {
  id?: ID;
  date: number;
  orders: ID[];
}
interface BillMonth {
  id?: ID;
  date: number;
  orders: ID[];
}
interface BillQuarterly {
  id?: ID;
  date: number;
  orders: ID[];
}
interface BillYear {
  id?: ID;
  date: number;
  orders: ID[];
}

class DB extends Dexie {
  order!: Table<Order>;

  category!: Table<Category>;

  currency!: Table<Currency>;

  wallet!: Table<Wallet>;

  billDay!: Table<BillDay>;

  billWeek!: Table<BillWeek>;

  billMonth!: Table<BillMonth>;

  billQuarterly!: Table<BillQuarterly>;

  billYear!: Table<BillYear>;

  constructor() {
    super('just-remember');

    this.version(1).stores({
      order: '++id, date',
      category: '++id, &name',
      currency: '++id, &name',
      wallet: '++id, &name',
      billDay: '++id, &date',
      billWeek: '++id, &date',
      billMonth: '++id, &date',
      billQuarterly: '++id, &date',
      billYear: '++id, &date',
    });
  }
}

const db = new DB();

export default db;
