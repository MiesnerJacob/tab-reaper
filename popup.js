document.addEventListener('DOMContentLoaded', () => {
  const reapNowButton = document.getElementById('reapNow');
  const reapGif = document.getElementById('reapGif');
  const nonInactiveGif = document.getElementById('nonInactiveGif');
  const messageElement = document.getElementById('message');
  const GIF_DISPLAY_DURATION = 3000; // 3 seconds

  const showGif = (gifElement) => {
    gifElement.style.display = 'block';
    setTimeout(() => {
      gifElement.style.display = 'none';
      messageElement.style.display = 'none';
    }, GIF_DISPLAY_DURATION);
  };

  const handleReapNowClick = () => {
    chrome.runtime.sendMessage({ action: 'reapNow' }, (response) => {
      if (response.success) {
        if (response.inactiveTabFound) {
          showGif(reapGif);
          messageElement.textContent = "Tabs reaped...";
        } else {
          showGif(nonInactiveGif);
          messageElement.textContent = "Nothing to reap...";
        }
        messageElement.style.display = 'block';
      }
    });
  };

  reapNowButton.addEventListener('click', handleReapNowClick);
});
