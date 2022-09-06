import Dexie, { type Table } from 'dexie';

export type ID = number;

export interface Order {
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
export interface Category {
  id?: ID;
  name: string;
  icon: string;
  orders: ID[];
}
export interface Wallet {
  id?: ID;
  name: string;
  remark?: string;
  balance: number;
  orders: ID[];
}

export interface Bill {
  id?: ID;
  date: number;
  orders: ID[];
}

type BillDay = Bill;
type BillWeek = Bill;
type BillMonth = Bill;
type BillQuarter = Bill;
type BillYear = Bill;

class DB extends Dexie {
  order!: Table<Order>;

  category!: Table<Category>;

  currency!: Table<Currency>;

  wallet!: Table<Wallet>;

  billDay!: Table<BillDay>;

  billWeek!: Table<BillWeek>;

  billMonth!: Table<BillMonth>;

  billQuarter!: Table<BillQuarter>;

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
      billQuarter: '++id, &date',
      billYear: '++id, &date',
    });
  }
}

const db = new DB();

export default db;
