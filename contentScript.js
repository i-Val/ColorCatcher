// let mouseX = 0;
// let mouseY = 0;

// Listen for the contextmenu (right-click) event
document.addEventListener('contextmenu', function(event) {
  // Capture the mouse coordinates before the context menu appears
  mouseX = event.pageX;
  mouseY = event.pageY;

  console.log("Mouse X:", mouseX, "Mouse Y:", mouseY);

  // You can perform any other logic here before the context menu is clicked
});

// Handle the message from the background script to copy the color
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.menuItemId === "copyRGB") {
    console.log(message)

     // Adjust for scroll position
  const adjustedX = mouseX - window.scrollX;
  const adjustedY = mouseY - window.scrollY;
    // Get the element at the captured mouse position
    const clickedElement = document.elementFromPoint(adjustedX, adjustedY);
    if (clickedElement) {
      const style = window.getComputedStyle(clickedElement);
      const color = style.backgroundColor || style.color; // Get background or text color

      // Copy the color to the clipboard
      navigator.clipboard.writeText(color).then(() => {
        showTemporaryNotification(`RGB Color ${color} copied to clipboard!`);
      }).catch(err => {
        console.error('Error copying to clipboard:', err);
      });
    } else {
      console.error("No element found at the clicked position.");
    }
  }
});

// Function to show a temporary notification
function showTemporaryNotification(message) {
  // Create the notification element
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = '#323232';
  notification.style.color = 'white';
  notification.style.padding = '10px';
  notification.style.borderRadius = '5px';
  notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
  notification.style.zIndex = '9999';
  
  // Add the notification to the page
  document.body.appendChild(notification);
  
  // Remove the notification after 3 seconds (3000 ms)
  setTimeout(() => {
    notification.remove();
  }, 1000);
}
