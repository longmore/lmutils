
import Tags from "./../lib/tags";

let util = {
    randomid(len = 7) {
        len = len <=2 || len > 24 ? 11 : len;
        let rad1 = Math.random().toString(36).slice(2);
        let rad2 = Math.random().toString(36).slice(2);
        let rad3 = Math.random().toString(36).slice(2);
        return (rad1 + rad2 + rad3).slice(2, len + 2);
    },
    isString(obj) {
        return (typeof obj === 'string') && obj.constructor === String;
    },
    setProp(target, key, value) {
        Reflect.defineProperty(target, key, {
            enumerable: false,
            configurable: false,
            writable: true,
            value: value
        });
    },
    isFunction(obj) {
        return (typeof obj === 'function') && obj.constructor === window.Function;
    },
    isEqual(one, two) {
        if (one === null || one === undefined || two === null || two === undefined) {
            return one === two;
        }
        if (one.constructor !== two.constructor) {
            return false;
        }
        if (one instanceof Function) {
            return one === two;
        }
        if (one instanceof RegExp) {
            return one === two;
        }
        if (one === two || one.valueOf() === two.valueOf()) {
            return true;
        }
        if (Array.isArray(one) && one.length !== two.length) {
            return false;
        }
        if (one instanceof Date) {
            return false;
        }
        if (!(one instanceof Object)) {
            return false;
        }
        if (!(two instanceof Object)) {
            return false;
        }
        let p = Object.keys(one);
        return Object.keys(two).every(function (i) {
                return p.indexOf(i) !== -1;
            }) && p.every(function (i) {
                return util.isEqual(one[i], two[i]);
            });
    },
    queue(arr) {
        let current = null, result = [];
        arr.forEach(task => {
            if (!current) {
                current = task();
            } else {
                current = current.then(info => {
                    result.push(info);
                    return task();
                });
            }
        });
        return current ? current.then((info) => {
            result.push(info);
            return result;
        }) : Promise.resolve([]);
    },
    isObject(obj) {
        return typeof (obj) === "object" && Object.prototype.toString.call(obj).toLowerCase() === "[object object]" && !obj.length;
    },
    isPlainObject(obj){
        return this.isObject(obj) && obj.constructor.prototype === Object.prototype;
    },
    isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    },
    isQueryString(str) {
        return util.isString(str) && /(^|&).*=([^&]*)(&|$)/.test(str);
    },
    parseQuery(url) {
        let obj = {};
        let reg = /([^?=&]+)=([^=&]+)/g;
        url.replace(reg, function ($0, $1, $2) {
            obj[$1] = $2;
        });

        return obj;
    },
    queryString(obj) {
        let result = [];
        if (obj) {
            for (let i in obj) {
                let val = obj[i];
                if (util.isString(val)) {
                    result.push(`${i}=${window.encodeURIComponent(val)}`);
                } else if (util.isObject(val) || util.isArray(val)) {
                    result.push(`${i}=${window.encodeURIComponent(JSON.stringify(val))}`);
                } else {
                    result.push(`${i}=${(val !== undefined && val !== null ? window.encodeURIComponent(val.toString()) : "")}`);
                }
            }
            return result.join("&");
        } else {
            return "";
        }
    },
    postData(obj) {
        if (obj) {
            if (obj instanceof FormData || obj instanceof Blob || obj instanceof ArrayBuffer) {
                return obj;
            } else if (util.isObject(obj)) {
                let has = false;
                for (let i in obj) {
                    if (obj[i] instanceof Blob || obj[i] instanceof ArrayBuffer || obj[i] instanceof File) {
                        has = true;
                        break;
                    }
                }
                if (has) {
                    let fd = new FormData();
                    for (let i in obj) {
                        if (obj[i] instanceof Blob) {
                            fd.append(i, obj[i]);
                        } else if (obj[i] instanceof File) {
                            fd.append(i, obj[i]);
                        } else if (util.isArray(obj[i]) || util.isObject(obj[i])) {
                            fd.append(i, window.encodeURIComponent(JSON.stringify(obj[i])));
                        } else if (obj[i] instanceof FormData) {
                        } else {
                            fd.append(i, window.encodeURIComponent(obj[i].toString()));
                        }
                    }
                    return fd;
                } else {
                    return util.queryString(obj);
                }
            } else if (util.isArray(obj)) {
                return window.encodeURIComponent(JSON.stringify({key: obj}));
            } else {
                return obj;
            }
        } else {
            return null;
        }
    },
    excuteStyle(code, path) {
        if (!document.getElementById(path)) {
            let _a = document.createElement("style");
            _a.setAttribute("media", "screen");
            _a.setAttribute("type", "text/css");
            _a.setAttribute("id", path);
            _a.appendChild(document.createTextNode(code));
            document.getElementsByTagName("head")[0].appendChild(_a);
        }
    },
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            var character = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + character;
            hash = hash & hash;
        }
        return hash;
    },
    encodeHTML(str) {
        if (/^\s*<(\w+|!)[^>]*>/.test(str)) {
            let temp = document.createElement("div");
            (temp.textContent != undefined) ? (temp.textContent = str) : (temp.innerText = str);
            return temp.innerHTML;
        } else {
            return str;
        }
    },
    getMappedPath(path) {
        return `P${Math.abs(util.hashCode(path))}`;
    },
    extend() {
        let options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[i] || {};
            i++;
        }
        if (typeof target !== "object" && !util.isFunction(target)) {
            target = {};
        }
        if (i === length) {
            target = this;
            i--;
        }
        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) {
                        continue;
                    }
                    if (deep && copy && (util.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && Array.isArray(src) ? src : [];
                        } else {
                            clone = src && util.isPlainObject(src) ? src : {};
                        }
                        target[name] = util.extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    }
};
export default util;
