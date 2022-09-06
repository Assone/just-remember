// eslint-disable-next-line @typescript-eslint/ban-types
type FluterOptional<T extends {}> = Pick<
  T,
  {
    [K in keyof T]: undefined extends T[K] ? never : K;
  }[keyof T]
>;
