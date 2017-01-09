"use strict";

console.log('hogefugapiyo');

chrome.tabs.onUpdated.addListener(function (tabId) {
  // populate all tabs
  let tabs = [];
  chrome.windows.getAll({ populate: true }, function (windows) {
    windows.forEach((window) => {
      window.tabs.forEach((tab) => {
        tabs.push(tab);
      });
    });
  });

  setTimeout(() => {
    // count twitter.com tabs
    let twitterTabsCount = 0;
    tabs.forEach((tab) => {
      const parser = document.createElement('a');
      parser.href = tab.url;
      console.log(parser.hostname);
      if (parser.hostname === 'twitter.com') { twitterTabsCount += 1; }
    });

    console.log(twitterTabsCount);

    if (twitterTabsCount > 2) {
      alert('Twitter やめろ');
      chrome.tabs.remove(tabId);
    }
  }, 100);
});
