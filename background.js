"use strict";

chrome.tabs.onUpdated.addListener((tabId) => {
  // populate all tabs
  const tabs = [];
  chrome.windows.getAll({ populate: true }, function (windows) {
    windows.forEach((window) => {
      window.tabs.forEach((tab) => {
        tabs.push(tab);
      });
    });

    // count twitter.com tabs
    let twitterTabsCount = 0;
    tabs.forEach((tab) => {
      const url = new URL(tab.url);
      if (url.hostname === 'twitter.com') { twitterTabsCount += 1; }
    });

    if (twitterTabsCount > 2) {
      alert('Twitter やめろ');
      chrome.tabs.remove(tabId);
    }
  });

});
