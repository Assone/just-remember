import type { Bill, ID } from '@/model/Database';
import db from '@/model/Database';
import { useObservable } from '@vueuse/rxjs';
import {
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import { liveQuery, type IndexableType, type Table } from 'dexie';
import { from } from 'rxjs';

type GetStartDate = (date: Date | number) => Date;

const useBillMethod = (
  table: Table<Bill, IndexableType>,
  getStartDate: GetStartDate
) => {
  const create = (data: Omit<Bill, 'id'>) => table.add(data);
  const del = (id: ID) => table.delete(id);
  const update = (id: ID, data: Partial<Omit<Bill, 'id'>>) =>
    table.update(id, data);
  const addOrderToBill = async (orderId: ID, date: number) => {
    const startDate = getStartDate(date).getTime();
    const data = await table.get({
      date: startDate,
    });
    const includeOrder = data?.orders.includes(orderId);

    if (data && !includeOrder) {
      table.put({
        ...data,
        orders: [...data.orders, orderId],
      });
    } else {
      table.add({
        date: startDate,
        orders: [orderId],
      });
    }
  };
  const delOrderToBill = async (orderId: ID) => {
    const order = await db.order.get(orderId);

    if (order) {
      const startDate = getStartDate(order.date);
      const data = await table.get(startDate);

      if (data && data.orders.includes(orderId)) {
        const orderIndex = data.orders.indexOf(orderId);

        table.update(startDate, {
          ...data,
          orders: data.orders.slice(orderIndex, 1),
        });
      }
    }
  };

  return {
    create,
    delete: del,
    update,
    addOrderToBill,
    delOrderToBill,
  };
};

export const useBill = defineStore('bill', () => {
  const bill = [
    db.billDay,
    db.billWeek,
    db.billMonth,
    db.billQuarter,
    db.billYear,
  ].map((billDB) =>
    useObservable(from(liveQuery(() => billDB.toArray())), {
      initialValue: [] as Bill[],
    })
  );
  const [day, week, month, quarter, year] = bill;

  const [
    currentDayBill,
    currentWeekBill,
    currentMonthBill,
    currentQuarterBill,
    currentYearBill,
  ] = [startOfDay, startOfWeek, startOfMonth, startOfQuarter, startOfYear].map(
    (fn, index) =>
      computed(() =>
        bill[index].value.find((b) => b.date === fn(Date.now()).getTime())
      )
  );

  const [
    { addOrderToBill: addOrderToBillDay, delOrderToBill: delOrderToBillDay },
    { addOrderToBill: addOrderToBillWeek, delOrderToBill: delOrderToBillWeek },
    {
      addOrderToBill: addOrderToBillMonth,
      delOrderToBill: delOrderToBillMonth,
    },
    {
      addOrderToBill: addOrderToBillQuarter,
      delOrderToBill: delOrderToBillQuarter,
    },
    { addOrderToBill: addOrderToBillYear, delOrderToBill: delOrderToBillYear },
  ] = Object.entries({
    billDay: startOfDay,
    billWeek: startOfWeek,
    billMonth: startOfMonth,
    billQuarter: startOfQuarter,
    billYear: startOfYear,
  }).map(([name, fn]) => useBillMethod(db[name as 'billDay'], fn));

  const addOrderToBill = async (orderId: ID, date: number = Date.now()) => {
    await db.transaction(
      'rw',
      [db.billDay, db.billWeek, db.billMonth, db.billQuarter, db.billYear],
      async () => {
        await Promise.all([
          addOrderToBillDay(orderId, date),
          addOrderToBillWeek(orderId, date),
          addOrderToBillMonth(orderId, date),
          addOrderToBillQuarter(orderId, date),
          addOrderToBillYear(orderId, date),
        ]);
      }
    );
  };

  const delOrderToBill = async (orderId: ID) => {
    await db.transaction(
      'rw',
      [db.billDay, db.billWeek, db.billMonth, db.billQuarter, db.billYear],
      async () => {
        await Promise.all([
          delOrderToBillDay(orderId),
          delOrderToBillWeek(orderId),
          delOrderToBillMonth(orderId),
          delOrderToBillQuarter(orderId),
          delOrderToBillYear(orderId),
        ]);
      }
    );
  };

  return {
    day,
    week,
    month,
    quarter,
    year,
    currentDayBill,
    currentWeekBill,
    currentMonthBill,
    currentQuarterBill,
    currentYearBill,
    addOrderToBill,
    delOrderToBill,
  };
});
