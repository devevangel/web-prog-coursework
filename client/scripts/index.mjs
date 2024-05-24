import { loadBrowserUrlState, handleBrowserBackBtnClick } from './router.mjs';

/**
 * Handles the browser's back button click event by calling the appropriate function.
 */
window.addEventListener('popstate', function () {
  handleBrowserBackBtnClick();
});

/**
 * Loads the initial state of the browser's URL when the page loads.
 */
window.addEventListener('load', function () {
  loadBrowserUrlState();
});
