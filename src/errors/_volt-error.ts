const errorMap = {
  unimplemented: (className: string, methodName: string) => ({
    message: `unimplemented: ${className}.${methodName} has not been implemented`,
  }),
  'bad-argument': (message: string) => ({
    message: `bad-argument: ${message}`,
  }),
} as const satisfies {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K: string]: (...args: any[]) => BaseVoltErrorContext<typeof K>;
};

type BaseVoltErrorContext<K extends string> = {
  message: `${K}: ${string}`;
};

type ErrorMap = typeof errorMap;
export type VoltErrorCode = keyof ErrorMap;
type VoltErrorFn<V extends VoltErrorCode> = ErrorMap[V];
type VoltErrorArgs<V extends VoltErrorCode> = Parameters<VoltErrorFn<V>>;
type VoltErrorContext<V extends VoltErrorCode> = ReturnType<ErrorMap[V]>;

export class VoltError<V extends VoltErrorCode> extends Error {
  public readonly context: VoltErrorContext<V>;
  constructor(errorCode: V, ...args: VoltErrorArgs<V>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorFn = errorMap[errorCode] as (...args: any[]) => VoltErrorContext<V>;
    const context = errorFn(...args);
    super(context.message);
    this.context = context;
  }
}
