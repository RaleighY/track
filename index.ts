import tracker from "./src/tracker";

function init(options: IInitOptions) {
  return tracker.init({
    appId: options.appId,
    url: options.url
  });
}
function trackView() {
  tracker.trackView();
}
function trackClick() {
  tracker.trackClick();
}
function trackScroll() {
  tracker.trackScroll();
}
function trackStore(storeName: string) {
  tracker.trackStore(storeName);
}
function trackCustom(type: string, data: any) {
  tracker.trackCustom(type, data);
}

export { init, trackView, trackClick, trackScroll, trackStore, trackCustom };
