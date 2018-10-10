// 驼峰转下划线
function camelToUnderline(str) {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

let camelStr = 'nameIsWhat';

console.log(camelToUnderline(camelStr));