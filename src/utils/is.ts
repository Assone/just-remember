const { toString } = Object.prototype;

type TypeKeys = 'object' | 'function';
const typeIs = (val: unknown, type: TypeKeys) =>
  toString.call(val).toLowerCase().slice(8, -1) === type;

export const { isArray } = Array;

export const isObject = (val: unknown): val is Record<any, any> =>
  typeIs(val, 'object');

export const isFunction = (
  val: unknown
): val is (...args: unknown[]) => unknown => typeof val === 'function';

export const isPromise = <T = any>(val: unknown): val is Promise<T> =>
  isObject(val) && isFunction(val.then) && isFunction(val.catch);

export const isString = (val: unknown): val is string =>
  typeof val === 'string';
