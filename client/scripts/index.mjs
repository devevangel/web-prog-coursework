import { mountPageRouter } from './router.mjs';
let initialHistoryLength = history.length;

mountPageRouter();


// Add event listener for popstate event
window.addEventListener('popstate', function () {
// Get the current length of the session history stack
  const currentHistoryLength = history.length;

  // Compare lengths to determine if back or forward button was clicked
  if (currentHistoryLength < initialHistoryLength) {
    console.log('Back button clicked');
  } else if (currentHistoryLength > initialHistoryLength) {
    console.log('Forward button clicked');
  }

  // Update initialHistoryLength for next comparison
  initialHistoryLength = currentHistoryLength;
});
