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

// ============================================================================
// 이터레이터를 활용한 함수형 프로그래밍 구현
// ============================================================================

// 제너레이터로 숫자 범위 생성 (지연 평가)
function* rangeIterator(start: number, end: number): Generator<number> {
  for (let i = start; i < end; i++) {
    yield i;
  }
}

// 무한 제너레이터
function* infiniteRange(start: number): Generator<number> {
  let i = start;
  while (true) {
    yield i++;
  }
}

// map: 이터레이터를 받아서 변환된 이터레이터를 반환
function* mapIterator<T, R>(
  iter: Iterable<T>,
  fn: (value: T) => R
): Generator<R> {
  for (const value of iter) {
    yield fn(value);
  }
}

// filter: 이터레이터를 받아서 필터링된 이터레이터를 반환
function* filterIterator<T>(
  iter: Iterable<T>,
  predicate: (value: T) => boolean
): Generator<T> {
  for (const value of iter) {
    if (predicate(value)) {
      yield value;
    }
  }
}

// take: 이터레이터에서 처음 n개만 가져오기
function* takeIterator<T>(iter: Iterable<T>, n: number): Generator<T> {
  let count = 0;
  for (const value of iter) {
    if (count >= n) break;
    yield value;
    count++;
  }
}

// reduce: 이터레이터를 순회하면서 누적값 계산
function reduceIterator<T, R>(
  iter: Iterable<T>,
  reducer: (acc: R, value: T) => R,
  initialValue: R
): R {
  let acc = initialValue;
  for (const value of iter) {
    acc = reducer(acc, value);
  }
  return acc;
}

// toArray: 이터레이터를 배열로 변환
function toArrayIterator<T>(iter: Iterable<T>): T[] {
  return Array.from(iter);
}

// pipe 함수: 함수들을 순차적으로 적용
function pipeIterator<T>(value: T): T;
function pipeIterator<T, A>(value: T, fn1: (x: T) => A): A;
function pipeIterator<T, A, B>(value: T, fn1: (x: T) => A, fn2: (x: A) => B): B;
function pipeIterator<T, A, B, C>(
  value: T,
  fn1: (x: T) => A,
  fn2: (x: A) => B,
  fn3: (x: B) => C
): C;
function pipeIterator<T, A, B, C, D>(
  value: T,
  fn1: (x: T) => A,
  fn2: (x: A) => B,
  fn3: (x: B) => C,
  fn4: (x: C) => D
): D;
function pipeIterator(value: any, ...fns: Array<(x: any) => any>): any {
  return fns.reduce((acc, fn) => fn(acc), value);
}

console.log("\n--- 이터레이터 기반 함수형 프로그래밍 ---");

// 예제 1: 기본 사용법
console.log("\n[예제 1] 기본 map, filter, reduce");
const iter1 = rangeIterator(1, 6);
const mapped1 = mapIterator(iter1, (x) => x * 2);
const filtered1 = filterIterator(mapped1, (x) => x > 5);
const result1 = reduceIterator(filtered1, (acc, x) => acc + x, 0);
console.log("결과:", result1); // (2+4+6+8+10) = 30

// 예제 2: 지연 평가 - 무한 시퀀스에서 처음 3개만 처리
console.log("\n[예제 2] 지연 평가 - 무한 시퀀스");
const infinite = infiniteRange(100000);
const mapped2 = mapIterator(infinite, (x) => {
  console.log(`  계산 중: ${x} * 2 = ${x * 2}`);
  return x * 2;
});
const taken2 = takeIterator(mapped2, 3);
const result2 = toArrayIterator(taken2);
console.log("결과:", result2); // [200000, 200002, 200004]
// 주목: 100000부터 시작해서 3개만 계산하고 멈춤!

// 예제 3: pipe를 사용한 체이닝
console.log("\n[예제 3] pipe를 사용한 체이닝");
const result3 = pipeIterator(
  rangeIterator(100, 200),
  (iter) =>
    mapIterator(iter, (n) => {
      console.log(`  map: ${n} -> ${n * 2}`);
      return n * 2;
    }),
  (iter) =>
    filterIterator(iter, (n) => {
      console.log(`  filter: ${n} > 100? ${n > 100}`);
      return n > 100;
    }),
  (iter) => takeIterator(iter, 3),
  toArrayIterator
);
console.log("결과:", result3);
// 주목: 필요한 만큼만 계산! (100부터 시작하지만 3개만 처리)

// 예제 4: reduce를 사용한 합계 계산
console.log("\n[예제 4] reduce를 사용한 합계");
const result4 = pipeIterator(
  rangeIterator(1, 11), // 1부터 10까지
  (iter) => mapIterator(iter, (x) => x * 2), // 각각 2배
  (iter) => filterIterator(iter, (x) => x > 5), // 5보다 큰 것만
  (iter) => reduceIterator(iter, (acc, x) => acc + x, 0) // 합계
);
console.log("결과:", result4); // (6+8+10+12+14+16+18+20) = 104

// ============================================================================
// for...of vs 일반 for 루프 성능 비교
// ============================================================================

function benchmark(
  name: string,
  fn: () => void,
  iterations: number = 1
): number {
  // 워밍업
  for (let i = 0; i < 10; i++) {
    fn();
  }

  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  return end - start;
}

console.log("\n--- for...of vs 일반 for 루프 성능 비교 ---");

const sizes = [1000, 10000, 100000, 1000000];

for (const size of sizes) {
  const arr = Array.from({ length: size }, (_, i) => i);
  let sum1 = 0;
  let sum2 = 0;
  let sum3 = 0;

  // 일반 for 루프 (인덱스 기반)
  const time1 = benchmark(
    `일반 for 루프 (${size}개)`,
    () => {
      sum1 = 0;
      for (let i = 0; i < arr.length; i++) {
        sum1 += arr[i]!; // 배열이므로 항상 존재함
      }
    },
    100
  );

  // for...of 루프
  const time2 = benchmark(
    `for...of 루프 (${size}개)`,
    () => {
      sum2 = 0;
      for (const value of arr) {
        sum2 += value;
      }
    },
    100
  );

  // forEach 메서드 (참고용)
  const time3 = benchmark(
    `forEach 메서드 (${size}개)`,
    () => {
      sum3 = 0;
      arr.forEach((value) => {
        sum3 += value;
      });
    },
    100
  );

  console.log(`\n[배열 크기: ${size.toLocaleString()}개]`);
  console.log(`  일반 for 루프:  ${time1.toFixed(2)}ms (기준)`);
  console.log(
    `  for...of 루프:  ${time2.toFixed(2)}ms (${(
      (time2 / time1 - 1) *
      100
    ).toFixed(1)}% ${time2 > time1 ? "느림" : "빠름"})`
  );
  console.log(
    `  forEach 메서드:  ${time3.toFixed(2)}ms (${(
      (time3 / time1 - 1) *
      100
    ).toFixed(1)}% ${time3 > time1 ? "느림" : "빠름"})`
  );

  // 결과 검증
  if (sum1 !== sum2 || sum1 !== sum3) {
    console.error("  ⚠️  계산 결과가 다릅니다!");
  }
}

console.log("\n--- 성능 분석 요약 ---");
console.log(`
일반 for 루프:
  ✅ 가장 빠름 (인덱스 직접 접근)
  ✅ V8 엔진 최적화가 잘 됨
  ✅ 메모리 접근 패턴이 예측 가능
  ❌ 코드가 다소 장황함

for...of 루프:
  ⚡ 일반 for보다 약 10-30% 느림 (작은 배열에서는 차이 미미)
  ✅ 가독성이 좋음
  ✅ 이터러블 객체(Set, Map 등)에도 사용 가능
  ✅ 배열 길이 체크 불필요
  ⚠️  내부적으로 이터레이터 생성 오버헤드

forEach 메서드:
  🐌 가장 느림 (함수 호출 오버헤드)
  ✅ 함수형 스타일
  ✅ 가독성 좋음
  ⚠️  break/continue 사용 불가

결론:
- 성능이 중요하면: 일반 for 루프
- 가독성/유지보수성: for...of 루프
- 함수형 스타일: forEach (성능 중요하지 않을 때)
`);
