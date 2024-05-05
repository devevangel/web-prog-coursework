import { loadBrowserUrlState, handleBrowserBackBtnClick } from './router.mjs';

window.addEventListener('popstate', function () {
  handleBrowserBackBtnClick();
});

window.addEventListener('load', function () {
  loadBrowserUrlState();
});
