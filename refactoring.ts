var array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var answer: any[] = [];
var window = 5;

for (var i = 0; i < array.length; i++) {
    var sum = 0;
    var count = 0;
    for (var w = 0; w < window; w++) {
        var idx = i + w;
        if (idx < array.length) {
            sum += array[idx]!;
            count++;
        }
    }
    answer.push(sum / count);
}

console.log(answer);

const result = array.map((_, idx) => {
    var subarray = array.slice(idx, idx + window);
    return subarray.reduce((acc, value) => {
        return acc + value;
    }, 0) / subarray.length;
});

console.log(result);
console.log(result.every((value, idx) => value === answer[idx]!));