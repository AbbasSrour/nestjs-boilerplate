export type Constructor<T = unknown, Arguments extends unknown[] = unknown[]> = new (
  ...arguments_: Arguments
) => T;

export type KeyOfType<Entity, U> = {
  [P in keyof Required<Entity>]: Required<Entity>[P] extends U
    ? P
    : Required<Entity>[P] extends U[]
      ? P
      : never;
}[keyof Entity];

export type RequireField<T, K extends keyof T> = T & Required<Pick<T, K>>;
