document.getElementById('selectColor').addEventListener('click', async (event) => {
  const button = event.target;
  button.disabled = true; // Disable button to prevent multiple clicks

  // Query the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs.length > 0) {
      // Try to capture the visible tab
      chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
        if (chrome.runtime.lastError) {
          console.error("Capture error: ", chrome.runtime.lastError);
          button.disabled = false;
          return;
        }

        if (dataUrl) {
          console.log("Screenshot captured!");
          
          // Inject the content script into the current tab
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['contentScript.js']
          }, () => {
            if (chrome.runtime.lastError) {
              console.error("Script injection error: ", chrome.runtime.lastError);
              button.disabled = false;
              return;
            }
            
            // Send the screenshot data to the content script
            chrome.tabs.sendMessage(tabs[0].id, { dataUrl: dataUrl }, (response) => {
              if (chrome.runtime.lastError) {
                console.error("Send message error: ", chrome.runtime.lastError);
              } else {
                console.log("Message sent successfully: ", response);
              }
              button.disabled = false; // Re-enable button after message is sent
            });
          });
        } else {
          console.error("Failed to capture screenshot.");
          button.disabled = false; // Re-enable button if capture fails
        }
      });
    } else {
      console.error("No active tabs found.");
      button.disabled = false;
    }
  });
});





chrome.runtime.onMessage.addListener((message) => {
  if (message.rgbColor) {
    const colorBox = document.getElementById('colorBox');
    const colorValue = document.getElementById('colorValue');
    
    // Set the background color and display the RGB value
    colorBox.style.backgroundColor = message.rgbColor;
    colorValue.textContent = message.rgbColor;
  }
});

