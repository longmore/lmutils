function deepClone(obj, target) {
    let newObj = target || {};
    for (let key in obj) {
        let item = obj[key];
        if (typeof item === 'object') {
            newObj[key] = (item.constructor === Array) ? [] : {};
            deepClone(item, newObj[key]);
        } else {
            newObj[key] = item;
        }
    }
    return newObj;
}

let a = {
    name: "鹏哥",
    age: 18,
    list: {
        a: 1,
        b: 2
    },
    child: [{
        name: 'longmore'
    }, {
        name: 'zhang'
    }]
};
let b = deepClone(a);
b.child[0].name = 'longmore2'
console.log(a)
console.log(b)