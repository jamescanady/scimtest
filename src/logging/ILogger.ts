export interface ILogger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(message: string, args: Record<string, any>): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(message: string, args: Record<string, any>): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(message: string, args: Record<string, any>): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(message: string, args: Record<string, any>): void;
}
