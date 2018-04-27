function quickSort (arr) {
    console.time('time---')
    if (arr.length <= 1) {
        return arr;
    }
    let left = [];
    let right = [];
    let midIndex = Math.floor(arr.length / 2);
    let mid = arr.splice(midIndex, 1)[0];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < mid) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    console.log(left)
    return quickSort(left).concat(mid, quickSort(right));
}
var arr=[3,44,38,5,47,15,36,26,27,2,46,4,19,50,48];
console.log(quickSort(arr));