import axios from "axios";
import { generateUUID, store, params2string, salt } from "./common";
// import * as md5 from "js-md5";

class Uploader {
  private url = "";
  private appId = "";
  private uuId = "";
  private version = "0.1.1";
  private localInfoName = "";

  q: any[] = [];
  qTimer: any = null;

  tsTimer: any = null;
  tsAmend = 0;

  setVersion(version: string) {
    this.version = version;
  }

  setUrl(url: string) {
    this.url = url;
  }

  setAppId(appId: string) {
    this.appId = appId;
  }

  setuuId() {
    // 判断本地有无uuid, 有就取，没有就生成然后存在本地
    this.uuId = store("Track_UUID");

    if (!this.uuId) {
      this.uuId = generateUUID();
      store("Track_UUID", this.uuId);
    }
  }

  setLocalInfoName(localInfoName: string) {
    this.localInfoName = localInfoName;
  }

  add(obj: any) {
    obj.timestamp = Date.now().valueOf() + this.tsAmend;
    this.q.push(obj);

    this.qTimer ||
      (this.qTimer = setTimeout(() => {
        this.flush();
      }, 1e3));
  }

  flush() {
    if (this.q.length > 0) {
      // console.log(this.q);

      const v = this.version,
        a = this.appId,
        u = this.uuId,
        t = Date.now().valueOf() + this.tsAmend,
        // s = md5(params2string({ ts: t, appId: a, salt: salt(a), uuid: u }));
        s = params2string({ ts: t, appId: a, salt: salt(a), uuid: u });

      axios.post(
        this.url +
          `/api/tracking/stat?${params2string({
            v,
            a,
            t,
            u,
            s
          })}`,
        params2string({
          key: {
            uuId: this.uuId,
            appId: this.appId,
            ts: t,
            sdkName: "track-web",
            localInfo: JSON.stringify(store(this.localInfoName)) || "",
            version: this.version,
            // @ts-ignore
            events: this.q
          }
        })
      );

      this.q = [];

      setTimeout(() => {
        this.flush();
      }, 1e3);
    } else {
      this.qTimer = null;
    }
  }

  timestampInterval() {
    if (this.tsTimer) {
      clearInterval(this.tsTimer);
    }
    this.fetchServerTimestamp();
    this.tsTimer = setInterval(() => this.fetchServerTimestamp(), 30000, true);
  }

  async fetchServerTimestamp() {
    axios.get(this.url + "/api/tracking/sync").then(res => {
      // @ts-ignore
      this.tsAmend = res.data.data.ts + res.spend - +Date.now();
    });
  }
}

let start = 0,
  end = 0;

axios.interceptors.request.use(res => {
  res.headers["Content-Type"] =
    "application/x-www-form-urlencoded;charset=UTF-8";
  start = +Date.now();
  return res;
});

axios.interceptors.response.use(res => {
  end = +Date.now();
  // @ts-ignore
  res.spend = end - start;
  return res;
});

export default new Uploader();
