import uploader from "./uploader";
class Track {
  scrollTimer: any;
  scrollY = 0;
  scrollYlast = 0;

  init(options: IInitOptions) {
    return new Promise((reslove, reject) => {
      if (options.appId) {
        // 存appId, 服务器url, uuid
        uploader.setAppId(options.appId);
        uploader.setUrl(options.url);

        // 设置用户唯一标识
        uploader.setuuId();

        // 启动服务器时间轮询
        uploader.timestampInterval();

        console.log("Track: 初始化成功");
        reslove();
      } else {
        if (!options.appId) {
          console.log("请填写AppId");
        }
        reject();
      }

      options.version && uploader.setVersion(options.version);
    });
  }

  trackView() {
    const params: IEventView = {
      type: "view",
      view: location.href,
      width: getDocWidth(),
      height: getDocHeight()
    };
    uploader.add(params);
  }

  trackClick() {
    window.addEventListener("click", e => {
      const params: IEventClick = {
        type: "click",
        // @ts-ignore
        id: e.target.id,
        x: e.pageX,
        y: e.pageY,
        width: getDocWidth(),
        height: getDocHeight(),
        view: location.href
      };

      uploader.add(params);
    });
  }

  trackScroll(target?: string) {
    const obj = target ? document.getElementById(target) : window;
    if (!obj) {
      console.log(`本页面没有ID为${target}的节点`);
      return false;
    }
    obj.addEventListener("scroll", e => {
      this.scrollY = Math.max(
        window.scrollY,
        document.body.scrollTop,
        document.documentElement.scrollTop,
        // @ts-ignore
        e.target.scrollTop ? e.target.scrollTop : 0
      );

      if (!this.scrollTimer) {
        this.scrollTimer = setInterval(() => {
          if (this.scrollYlast !== this.scrollY) {
            const params = {
              type: "scroll",
              scrollY: this.scrollY,
              width: getDocWidth(),
              height: getDocHeight(),
              view: location.href
            };
            uploader.add(params);
          }

          this.scrollYlast = this.scrollY;
        }, 300);
      }
    });
  }

  trackStore(storeName: string) {
    uploader.setLocalInfoName(storeName);
  }

  trackCustom(type: string, data?: any) {
    const params: IEventByU = {
      type,
      data,
      view: location.href
    };

    uploader.add(params);
  }
}

function getDocWidth() {
  var D = document;
  return Math.max(
    Math.max(D.body.scrollWidth, D.documentElement.scrollWidth),
    Math.max(D.body.offsetWidth, D.documentElement.offsetWidth),
    Math.max(D.body.clientWidth, D.documentElement.clientWidth)
  );
}

function getDocHeight() {
  var D = document;
  return Math.max(
    Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
    Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
    Math.max(D.body.clientHeight, D.documentElement.clientHeight)
  );
}

export default new Track();
