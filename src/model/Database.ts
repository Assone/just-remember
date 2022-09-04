import Dexie from 'dexie';
import type { Table } from 'dexie';

type ID = number;

export interface Category {
  id?: ID;
  orders: ID[];
  name: string;
  icon: string;
}

export interface Wallets {
  id?: ID;
  name: string;
  balance: number;
  orders: ID[];
  remark?: string;
}

export interface Order {
  id?: ID;
  category: ID;

  description: string;

  createAt: number;
  updateAt?: number;
}

class DB extends Dexie {
  category!: Table<Category>;

  wallets!: Table<Wallets>;

  order!: Table<Order>;

  constructor() {
    super('just-remember');

    this.version(1).stores({
      category: '++id, name, orders',
      wallets: '++id, name, balance, orders, remark',
      order: '++id, category, description, createAt, updateAt',
    });
  }
}

const db = new DB();

export default db;
