export type Result<T> = None | Some<T>;
export type AsyncResult<T> = Promise<Result<T>>;

export type None = [null, Error];
export type Some<T> = [T, "OK"];

export type VoidResult = "OK" | Error;
export type AsyncVoidResult = Promise<VoidResult>;

export function some<T>(data: T): Some<T> {
  return [data, "OK"];
}

export function none(error: string | Error): None {
  if (typeof error === "string") {
    error = new Error(error);
  }

  return [null, error];
}

export function panic(error: Error): never {
  console.error("Panicked:", error);
  const e = new Error();
  console.error("Callstack:", e.stack);
  process.exit(1);
}


export function success(): VoidResult {
  return "OK";
}

export function failure(err: string | Error): VoidResult {
  if (typeof err === "string") {
    err = new Error(err);
  }

  return err;
}
