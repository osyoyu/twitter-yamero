"use strict";

let active = true;

function countTwitterTabs(callback) {
  let twitterTabsCount = 0;

  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      const url = new URL(tab.url);
      if (url.hostname === 'twitter.com') { twitterTabsCount += 1; }
    });

    callback(twitterTabsCount);
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.hasOwnProperty('url')) {
    countTwitterTabs((count) => {
      chrome.browserAction.setBadgeText({
        text: count.toString()
      });

      if (active && count > 2) {
        alert('Twitter やめろ');
        chrome.tabs.remove(tabId);
      }
    });
  }
});

chrome.tabs.onRemoved.addListener(() => {
  // update badge
  countTwitterTabs((count) => {
    chrome.browserAction.setBadgeText({
      text: count.toString()
    });
  });
});

chrome.browserAction.onClicked.addListener((tab) => {
  if (active) {
    active = false;
    chrome.browserAction.setIcon({
      path: {
        '16': 'icons/icon16-inactive.png'
      }
    });
  }
  else {
    countTwitterTabs((count) => {
      if (count > 2) {
        alert("まず Twitter をやめる意志を見せろ");
        return;
      }

      active = true;
      chrome.browserAction.setIcon({
        path: {
          '16': 'icons/icon16.png'
        }
      });
    });
  }
});