# Result
Result is a simple (40 lines) typescript library for writing a result type inspired by Go's multi-return pattern of the value and an error. Built to be typesafe and expects you to use typescript (really, there's no point in this unless you do). I find myself repeating a version of these types in lots of projects, so I put them in one repo.

# Install
Just copy and paste the code in `index.ts` into your project. Alternatively, if you love adding flaky dependencies to your app:

```bash
npm install @firesquid/result
```

# Example

```ts
import type { Result } from ".";
import { some, none, panic } from "."

function myFailableFunction(): Result<number> {
  // foo is just some imaginary function that returns a number
  const myValue = foo();
  
  if (myValue < 0) {
    // something has gone wrong!
    //
    // we can give none an Error or a string. If given a string, it will
    // automatically turn it into an Error
    return none("myValue was less than 0.");
  }

  return some(myValue); 
}


function main() {
  // the const here is important
  const [val, err] = myFailableFunction();
  
  // if we type:
  // val;
  //
  // The editor recognizes its type as number | null and will not let you
  // use it


  if (err !== "OK") {
    // This error is irrecoverable and represents a completely screwed state
    // We can use panic to signify this
    //
    // If the error is recoverable, you should return here instead
    panic(err);
  }

  // the type system recognizes that val is a number and cannot be null at 
  // this point. We can do whatever we want since we're on the happy
  // path
  let anotherValue = val + 1;

  console.log(anotherValue);
}
```

# More
The example above demonstrates use of `some`, `none`, `Result`, and `panic`. This library also includes:
- `AsyncResult` - a handy alias for `Promise<Result>` because I think the latter is ugly and less readable. Some may disagree and can throw it away
- `VoidResult` - just `"OK" | Error`. Useful for functions that are void but could also fail with an error message. Just like how `Result` has the methods `some` and `none` for constructing it, `VoidResult` has `success` and `failure` for its respective possibilities.


# Source Code
For copying and pasting convenience, here's all 40 lines that make up the source:
```ts
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
```
