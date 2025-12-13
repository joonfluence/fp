import { filter, map, pipe, range, reduce, take, toArray } from "@fxts/core";

console.log("--- 1. 지연평가 테스트 ---");

const result = pipe(
  [1, 2, 3, 4, 5],
  (arr) => arr.map((x) => x * 2),
  (arr) => arr.filter((x) => x > 5),
  (arr) => arr.reduce((acc, x) => acc + x, 0)
);

console.log(result);

const resultTwo = pipe(
  range(100000, Infinity),
  map((a: number) => a * 2),
  take(3),
  toArray
);

console.log(`최종 결과 (합산): ${resultTwo}`);

const N = 200; // 100개의 데이터

// (1) 데이터 생성: 0부터 N-1까지의 배열을 즉시 생성합니다.
const numbers = [];
for (let i = 100; i < N; i++) {
  numbers.push(i);
}
console.log(`Step 1: ${N}개의 데이터가 메모리에 즉시 생성됨`);

const resultThree = numbers
  // (2) map: 원본 배열을 변경하지 않고, 새로운 100개 요소의 배열을 생성합니다.
  .map((n) => {
    console.log(`Step 2 (map): ${n}을 두 배로 계산`);
    return n * 2;
  })
  // (3) filter: 원본 배열을 변경하지 않고, 또 다른 새로운 배열을 생성합니다.
  .filter((n) => {
    console.log(`Step 3 (filter): ${n}을 필터링`);
    return n > 100;
  })
  // (4) slice: 원본 배열을 변경하지 않고, 앞 3개만 포함한 새로운 배열을 반환합니다.
  .slice(0, 3);

console.log("\n--- JavaScript 결과 ---");
console.log("최종 결과:", resultThree);
// 결과적으로 3개의 값만 필요했지만, 100만 개 이상의 임시 배열이 생성되었습니다.
