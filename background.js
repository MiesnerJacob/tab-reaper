// Constants
const DEFAULT_INACTIVITY_LIMIT = 30 * 60 * 1000; // Default to 30 minutes
const CHECK_TABS_INTERVAL_MINUTES = 1;
// State variables
let inactivityLimit = DEFAULT_INACTIVITY_LIMIT;
let autoReap = false;

// Functions
const getSettings = async () => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['inactivityLimit', 'autoReap'], (data) => {
      inactivityLimit = data.inactivityLimit ? data.inactivityLimit * 60 * 1000 : DEFAULT_INACTIVITY_LIMIT;
      autoReap = data.autoReap || false;
      resolve();
    });
  });
};

const closeInactiveTab = (tabId) => {
  chrome.tabs.remove(tabId, () => {
    console.log(`Tab with id ${tabId} closed due to inactivity.`);
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Tab Reaper',
      message: 'A tab has been closed due to inactivity.'
    });
  });
};

const checkTabs = async () => {
  await getSettings();
  const tabs = await chrome.tabs.query({});
  const currentTime = Date.now();
  let inactiveTabFound = false;

  tabs.forEach(tab => {
    if (tab.id && tab.lastAccessed && currentTime - tab.lastAccessed > inactivityLimit) {
      closeInactiveTab(tab.id);
      inactiveTabFound = true;
    }
  });

  return inactiveTabFound;
};

const initialize = async () => {
  await getSettings();
  if (autoReap) {
    chrome.alarms.create('checkTabs', { periodInMinutes: CHECK_TABS_INTERVAL_MINUTES });
  }
};

// Event Listeners
chrome.runtime.onInstalled.addListener(initialize);

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkTabs') {
    checkTabs();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'reapNow') {
    checkTabs().then((inactiveTabFound) => {
      sendResponse({ success: true, inactiveTabFound });
    });
    return true;
  }
});