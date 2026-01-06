import { reduce } from "@fxts/core";

function mutableMap<T, U>(array: T[], f: (value: T) => U): U[] {
  return reduce<T, U[]>(
    (acc: U[], value: T) => {
      acc.push(f(value));
      return acc;
    },
    [],
    array
  );
}

function mutableFilter<T>(array: T[], f: (value: T) => boolean): T[] {
  return reduce<T, T[]>(
    (acc: T[], value: T) => {
      if (f(value)) {
        acc.push(value);
      }
      return acc;
    },
    [],
    array
  );
}

function immutableMap<T, U>(array: T[], f: (value: T) => U): U[] {
  return reduce<T, U[]>(
    (acc: U[], value: T) => acc.concat(f(value)),
    [],
    array
  );
}

function immutableFilter<T>(array: T[], f: (value: T) => boolean): T[] {
  return reduce<T, T[]>(
    (acc: T[], value: T) => {
      if (f(value)) {
        return acc.concat(value);
      }
      return acc;
    },
    [],
    array
  );
}

const array = [1, 2, 3, 4, 5];
const result = mutableMap(array, (value) => value * 2);
console.log(result);

const result2 = mutableFilter(array, (value) => value % 2 === 0);
console.log(result2);

const result3 = immutableMap(array, (value) => value * 2);
console.log(result3);

const result4 = immutableFilter(array, (value) => value % 2 === 0);
console.log(result4);
