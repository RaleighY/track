// generate UUID
export function generateUUID() {
  var d = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
    c
  ) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

// params2string
export function params2string(params: { [key: string]: any }) {
  var str = [];
  for (var i in params) {
    if (typeof params[i] === "object") {
      str.push(i + "=" + encodeURIComponent(JSON.stringify(params[i])));
    } else {
      str.push(i + "=" + encodeURIComponent(params[i] as string));
    }
  }
  return str.join("&");
}

// 每隔x秒请求服务器时间
export function pollingServerTime(url: string, interval: number): number {
  // 请求服务器，成功返回服务器时间，失败返回本地时间
  return Date.now();
}

// salt混淆
export function salt(s: string) {
  const arr = s.split("");
  return arr
    .map((value, index) => {
      if (index % 2 === 0) {
        return arr[index + 1] || value;
      } else {
        return arr[index - 1];
      }
    })
    .join("");
}

export function store(key: string, value?: string, storageOnly?: boolean) {
  storageOnly = storageOnly || false;
  var lsSupport = false,
    data;

  // Check for native support
  lsSupport = true;
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("testLocal", "true");
    }
  } catch (e) {
    lsSupport = false;
  }

  // If value is detected, set new or modify store
  if (typeof value !== "undefined" && value !== null) {
    // Convert object values to JSON
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }
    // Set the store
    if (lsSupport) {
      // Native support
      localStorage.setItem(key, value);
    } else if (!storageOnly) {
      // Use Cookie
      createCookie(key, value, 30);
    }
  }

  // No value supplied, return value
  if (typeof value === "undefined") {
    // Get value
    if (lsSupport) {
      // Native support
      data = localStorage.getItem(key);
    } else if (!storageOnly) {
      // Use cookie
      data = readCookie(key);
    }

    // Try to parse JSON...
    try {
      data = JSON.parse(data);
    } catch (e) {
      //it means data is not json,
      //dont do anything
    }

    return data;
  }

  // Null specified, remove store
  if (value === null) {
    if (lsSupport) {
      // Native support
      localStorage.removeItem(key);
    } else if (!storageOnly) {
      // Use cookie
      createCookie(key, "", -1);
    }
  }

  /**
   * Creates new cookie or removes cookie with negative expiration
   * @param  key       The key or identifier for the store
   * @param  value     Contents of the store
   * @param  exp       Expiration - creation defaults to 30 days
   */

  function createCookie(key: string, value: string, exp: number) {
    var date = new Date();
    date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
    var expires = "; expires=" + date.toUTCString();
    document.cookie = key + "=" + value + expires + "; path=/";
  }

  /**
   * Returns contents of cookie
   * @param  key       The key or identifier for the store
   */

  function readCookie(key: string) {
    var nameEQ = key + "=";
    var ca = document.cookie.split(";");
    for (var i = 0, max = ca.length; i < max; i++) {
      var c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }
}
