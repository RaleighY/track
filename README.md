# Track

从之前的项目需求中提取出来的 web 端埋点 sdk，施工改造中

可参考：countly，cnzz

## Todo

- 配置 rollup
- 精简 uploader

## 快速上手

```js
  <script>
    (function() {
      var tr = document.createElement("script");
      tr.type = "text/javascript";
      tr.async = true;

      tr.src = "/path/to/track.js";  // js的路径

      tr.onload = function() {
        Track.init({
            appId: "123412341234123412341234123412341234", // 填写我们给你的appId
            url:
              "http://tiangong-event-tracking-service.test01.tianrang-inc.com" // 填写你的服务器url
          }).then(() => {
            Track.trackView();    // 追踪页面
            Track.trackClick();   // 追踪所有的点击
            Track.trackScroll();
            Track.trackStore('storeName') // 填写需要追踪的缓存字段
            Track.trackScroll('#id') // 填写想要追踪滚动的节点的id，默认为window，不填的话为追踪window
          });
      };

      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(tr, s);
    })();
  </script>
```

此外，如果你的应用是单页面应用，那么你在追踪页面事件的时候需要多做一部额外的操作，取决于你的路由是 hash 模式还是 history 模式

- hash

  ```js

  <script>
    (function() {
      var tr = document.createElement("script");
      tr.type = "text/javascript";
      tr.async = true;

      tr.src = "/path/to/track.js";  // js的路径

      tr.onload = function() {
        Track.init({
            appId: "123412341234123412341234123412341234",
            url:
              "http://tiangong-event-tracking-service.test01.tianrang-inc.com"
          }).then(() => {
            Track.trackView();
            Track.trackClick();
            Track.trackScroll();
          });

        // 比普通模式要多写一个监听
        window.onhashchange = function() {
          Track.trackView();
        };
      };

      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(tr, s);
    })();
  </script>
  ```

- history

  history.js 中

  ```js
  import browserHistory from "history/createBrowserHistory";

  const history = browserHistory();

  history.listen(() => {
    // @ts-ignore
    if (window.Track) {
      Track.trackView();
    }
  });
  ```

## 如何验证加载成功

Console 中看到 `Track: 初始化成功` 的输出即加载成功
