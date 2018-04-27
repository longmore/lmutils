function error (msg, url, line) {
    let report_url = '';
    let info = [msg, url, line, window.navigator.userAgent, +new Date()];
    report_url = report_url + info.join('||');
    let img = new Image();
    img.onload = img.onerror = function () {
        img = null;
    }
    img.src = url; // 发送数据到后台url
    console.log(info);
}

window.onerror = function(errorMessage, scriptURI, lineNumber,columnNumber,errorObj) {
    console.log("错误信息：" , errorMessage);
    console.log("出错文件：" , scriptURI);
    console.log("出错行号：" , lineNumber);
    console.log("出错列号：" , columnNumber);
    console.log("错误详情：" , errorObj);
  }
  throw new Error("出错了！");