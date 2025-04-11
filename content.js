chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message recieved here");
    if (request.action === "analyze_images") {
        const images = document.querySelectorAll("img"); // Select all images on Pinterest page
        let imageDataArray = [];

        images.forEach((img, index) => {
            console.log("Image: ", index, img.src);
            fetchImageAsBase64(img.src).then(base64 => {
                imageDataArray.push(base64);

                if (index === images.length - 1) {
                    // Send the collected Base64 images to the background script for API processing
                    chrome.runtime.sendMessage({ action: "send_to_gemini", images: imageDataArray });
                }
            }).catch(error => console.error("Error converting image to Base64:", error));
        });
    }
});

// Function to convert image URL to Base64
async function fetchImageAsBase64(imageUrl) {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(",")[1]); // Extract Base64 without metadata
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Failed to fetch image:", error);
        return null;
    }
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "speak_text") {
        console.log("Speaking:", request.text);
        speak(request.text);
    }
});

function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = 1.0;
        utterance.volume = 1.0;
        setTimeout(() => {
            speechSynthesis.speak(utterance);
        }, 500);
    } else {
        console.error("Text-to-Speech not supported in this browser.");
    }
}







