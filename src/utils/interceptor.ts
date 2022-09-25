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
    const returnValue = interceptor(...args);

    if (isPromise(returnValue)) {
      returnValue
        .then((value) => {
          if (value) {
            done();
          } else if (canceled) {
            canceled();
          }
        })
        .catch(noop);
    } else if (returnValue) {
      done();
    } else if (canceled) {
      canceled();
    }
  } else {
    done();
  }
};
