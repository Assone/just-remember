interface InterceptorOptions {
  args?: unknown[];
  done: () => void;
  canceled?: () => void;
}

export type Interceptor = (
  ...args: unknown[]
) => Promise<boolean> | boolean | undefined | void;

export const callInterceptor = (
  interceptor: Interceptor | undefined,
  { args = [], done, canceled }: InterceptorOptions
) => {
  if (interceptor) {
    const value = interceptor(...args);

    if (isPromise(value)) {
      value
        .then((v) => {
          if (v) {
            done();
          } else if (canceled) {
            canceled();
          }
        })
        .catch(noop);
    } else if (value) {
      done();
    } else if (canceled) {
      canceled();
    }
  } else {
    done();
  }
};
