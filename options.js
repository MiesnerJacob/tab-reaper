document.getElementById('saveOptions').addEventListener('click', () => {
    const inactivityLimit = document.getElementById('inactivityLimit').value;
    const autoReap = document.getElementById('autoReap').checked;
    chrome.storage.sync.set({ inactivityLimit: parseInt(inactivityLimit), autoReap: autoReap }, () => {
      alert('Options saved.');
    });
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['inactivityLimit', 'autoReap'], (data) => {
      document.getElementById('inactivityLimit').value = data.inactivityLimit || 1; // Default to 1 minute
      document.getElementById('autoReap').checked = data.autoReap || false; // Default to not checked
    });
  });
