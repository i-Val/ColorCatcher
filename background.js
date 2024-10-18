chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "copyRGB",
    title: "Copy RGB Color",
    contexts: ["all"]
  });
});



chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copyRGB") {
    // Inject the content script into the active tab
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['contentScript.js']
    }, () => {
      // After injecting, send the coordinates to the content script
      chrome.tabs.sendMessage(tab.id, info);
      // chrome.tabs.sendMessage(tab.id, { x: info.pageX, y: info.pageY });
    });
  }
});
