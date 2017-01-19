"use strict";

/* global chrome */

const MAX_TWITTER_TABS = 2;

class App {
  constructor() {
    this.isActive = false;
    this.twitterTabs = new Map([]);

    const handlerNames = Object.getOwnPropertyNames(App.prototype).filter(key => key.match(/^on[A-Z]/) !== null);
    for (const handlerName of handlerNames) {
      this[handlerName] = this[handlerName].bind(this);
    }

    chrome.browserAction.onClicked.addListener(this.onButtonClicked);
    chrome.tabs.onUpdated.addListener(this.onTabUpdate);
    chrome.tabs.onRemoved.addListener(this.onTabRemove);

    this.collectTabsStats();
  }

  collectTabsStats() {
    chrome.tabs.query({
      url: '*://twitter.com/*'
    }, (tabs) => {
      this.twitterTabs = new Map(tabs.map(tab => [tab.id, tab]));

      this.onTwitterTabsUpdate();
    });
  }

  onTwitterTabsUpdate() {
    this.updateBadge();
  }

  updateBadge() {
    chrome.browserAction.setBadgeText({
      text: this.twitterTabs.size.toString()
    });
  }

  onTabUpdate(tabId, changeInfo, tab) {
    if (Object.hasOwnProperty.call(changeInfo, 'url')) {
      const urlObj = new URL(changeInfo.url);
      if (urlObj.hostname === 'twitter.com') {
        this.onNewTwitterTab(tab);
      }
    }
  }

  onNewTwitterTab(tab) {
    this.twitterTabs.set(tab.id, tab);
    this.onTwitterTabsUpdate();
    this.twitterYamero(tab);
  }

  onTabRemove(tabId) {
    this.twitterTabs.delete(tabId);
    this.onTwitterTabsUpdate();
  }

  twitterYamero(tab) {
    if (!this.isActive) { return; }
    if (!this.isTooManyTwitterTabs()) { return; }

    chrome.tabs.remove(tab.id);

    this.onTabRemove(tab.id);
    chrome.tabs.highlight({ tabs: [...this.twitterTabs.values()].map(tab => tab.index) });
  }

  onButtonClicked() {
    if (this.isActive) {
      this.disableYamero();
    } else {
      this.enableYamero();
    }
  }

  changeIcon(iconPath) {
    chrome.browserAction.setIcon({
      path: {
        '16': iconPath
      }
    });
  }

  enableYamero() {
    if (this.isTooManyTwitterTabs()) {
      alert("まず Twitter をやめる意志を見せろ");
      return;
    }

    this.isActive = true;
    this.changeIcon('icons/icon16-inactive.png');
  }

  disableYamero() {
    this.isActive = false;
    this.changeIcon('icons/icon16.png');
  }

  isTooManyTwitterTabs() {
    return this.twitterTabs.size > MAX_TWITTER_TABS;
  }
}

new App();
