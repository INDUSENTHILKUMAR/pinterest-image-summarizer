document.addEventListener("DOMContentLoaded", function exec() {
    document.getElementById("analyzeBtn").addEventListener("click", function () {
        // Send a message to content script to start analyzing images
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0].url.includes("pinterest.com")) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "analyze_images" });
                document.getElementById("status").textContent = "Analyzing images...";
            } else {
                document.getElementById("status").textContent = "This extension only works on Pinterest.";
            }
        });
    });
}); 
