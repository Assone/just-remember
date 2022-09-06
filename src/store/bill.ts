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

const useBillMethod = (
  table: Table<Bill, IndexableType>,
  getStartDate: (date: Date | number) => Date
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
  const day = useObservable(from(liveQuery(() => db.billDay.toArray())), {
    initialValue: [] as Bill[],
  });
  const week = useObservable(from(liveQuery(() => db.billWeek.toArray())), {
    initialValue: [] as Bill[],
  });
  const month = useObservable(from(liveQuery(() => db.billMonth.toArray())), {
    initialValue: [] as Bill[],
  });
  const quarter = useObservable(
    from(liveQuery(() => db.billQuarter.toArray())),
    {
      initialValue: [] as Bill[],
    }
  );
  const year = useObservable(from(liveQuery(() => db.billYear.toArray())), {
    initialValue: [] as Bill[],
  });

  const {
    addOrderToBill: addOrderToBillDay,
    delOrderToBill: delOrderToBillDay,
  } = useBillMethod(db.billDay, startOfDay);
  const {
    addOrderToBill: addOrderToBillWeek,
    delOrderToBill: delOrderToBillWeek,
  } = useBillMethod(db.billWeek, startOfWeek);
  const {
    addOrderToBill: addOrderToBillMonth,
    delOrderToBill: delOrderToBillMonth,
  } = useBillMethod(db.billMonth, startOfMonth);
  const {
    addOrderToBill: addOrderToBillQuarter,
    delOrderToBill: delOrderToBillQuarter,
  } = useBillMethod(db.billQuarter, startOfQuarter);
  const {
    addOrderToBill: addOrderToBillYear,
    delOrderToBill: delOrderToBillYear,
  } = useBillMethod(db.billYear, startOfYear);

  const addOrderToBill = async (orderId: ID, date: number) => {
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
    addOrderToBill,
    delOrderToBill,
  };
});
