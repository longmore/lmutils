function underlineTocamel(str) {
    return str.replace(/_(\w)/g, function (all, $1) {
        return $1.toUpperCase();
    })
}

let underlineStr = 'name_is_what';

console.log(underlineTocamel(underlineStr));
