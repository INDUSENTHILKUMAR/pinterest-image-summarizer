chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "send_to_gemini") {
        console.log(request.images);
        request.images.forEach((data) => {
            analyzeImage(data);

        })
    }
});
//AIzaSyCFzeKDjOutOPfjOADZ8jpDvuLk_SPdkDw
async function analyzeImage(base64Image) {
    const GEMINI_API_KEY = "AIzaSyCFzeKDjOutOPfjOADZ8jpDvuLk_SPdkDw"; // Replace with your API Key
    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    const requestBody = {
        contents: [
            { role: "user", parts: [    
                { text: "Describe this image for a visually impaired user. Focus on theme, colors, objects, and surroundings." },
                { inline_data: { mime_type: "image/jpeg", data: base64Image } }
            ]}
        ]
    };

    try {
        const response = await fetch(`${endpoint}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
       // console.log(data);
        if (data.candidates && data.candidates.length > 0) {
            const description = data.candidates[0].content.parts[0].text;
            console.log("Image Description:", description);
            //speak(description); // 🔊 Read aloud the description
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: "speak_text", text: description });
            });
        } else {
            console.error("No valid response from Gemini API");
        }
    } catch (error) {
        console.error("Error analyzing image:", error);
    }
}

// 🔊 Text-to-Speech (TTS) Function - No need for a separate file






