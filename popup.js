



document.getElementById('activate-btn').addEventListener('click', function() {
    chrome.runtime.sendMessage({command: 'activate'});
    this.textContent = this.textContent === 'ON' ? 'OFF' : 'ON';
    document.getElementById('flip-buttons').style.display = this.textContent === 'ON' ? 'none' : 'block';
});


document.getElementById('flip-horizontal').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'flip-horizontal'});
    });
});

document.getElementById('flip-vertical').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'flip-vertical'});
    });
});

function sendCommand(command) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { command: command });
    });
}
