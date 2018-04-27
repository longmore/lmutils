import util from "./../util/util";

const EVENTYPES = ["readystatechange", "loadstart", "progress", "abort", "error", "load", "timeout", "loadend"];

class request {
    constructor({
                    data = {},
                    body = "",
                    url = "",
                    method = "post",
                    dataType = "text",
                    async = true,
                    timeout = 3000000,
                    headers = {},
                    events = {},
                    mimeType = ''
                }) {
        this.option = arguments[0];
        let _xhr = new XMLHttpRequest();
        this._xhr = _xhr;
        if (mimeType) {
            _xhr.overrideMimeType(mimeType);
        }
        if (!body) {
            if (method === "get") {
                let querystr = util.queryString(data);
                url += (url.indexOf("?") !== -1 ? (querystr === "" ? "" : "&" + querystr) : (querystr === "" ? "" : "?" + querystr));
            } else {
                data = util.postData(data);
            }
        }
        _xhr.open(method, url, async);
        if (async) {
            _xhr.responseType = dataType === "json" ? "text" : dataType;
            _xhr.timeout = timeout;
        }
        EVENTYPES.forEach(type => {
            _xhr.addEventListener(type, (e) => {
                let deal = events[e.type];
                deal && deal.call(this, e);
            }, false);
        });
        _xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        for (let i in headers) {
            _xhr.setRequestHeader(i, headers[i]);
        }
        if (util.isQueryString(data)) {
            _xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }
        _xhr.send(body ? body : data);
    }
}

function ajax(option = {}) {
    return new Promise((resolve, reject) => {
        option.events = Object.assign({
            error(e) {
                reject(e);
            },
            load(e) {
                let status = this._xhr.status;
                if ((status >= 200 && status < 300) || status === 304 || status === 0) {
                    let result = this._xhr.response;
                    if (this.option.dataType === "json") {
                        try {
                            result = JSON.parse(this._xhr.responseText);
                        } catch (e) {
                            throw Error("[topolr] ajax unvaliable json string,url is '" + option.url + "' " + e);
                        }
                    }
                    resolve(result);
                } else {
                    reject(e);
                }
            }
        }, option.events);
        new request(option);
    });
}
function get(url, data = {}) {
    return ajax({url, data, method: "get"});
}
function post(url, data = {}) {
    return ajax({url, data, method: "post", dataType: "json"});
}

export {ajax, get, post};
export default request;
