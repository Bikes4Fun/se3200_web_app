const API_URL = "http://localhost:8080";

const form = document.getElementById("messageForm");
const input = document.getElementById("messageInput");
const list = document.getElementById("messagesList");

async function fetchMessages() {
    try {
        const response = await fetch(`${API_URL}/messages`);
        const messages = await response.json();
        
        if (messages.length === 0) {
            list.innerHTML = '<div class="empty">No messages yet</div>';
        } else {
            list.innerHTML = messages
                .map(msg => `<div class="message-item">${escapeHtml(msg)}</div>`)
                .join("");
        }
    } catch (error) {
        list.innerHTML = '<div class="empty">Error loading messages</div>';
    }
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const message = input.value.trim();
    if (!message) return;
    
    try {
        await fetch(`${API_URL}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });
        
        input.value = "";
        await fetchMessages();
    } catch (error) {
        alert("Error posting message");
    }
});

fetchMessages();
