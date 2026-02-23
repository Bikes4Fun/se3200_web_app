const API_URL = "http://localhost:8080";

const form = document.getElementById("messageForm");
const input = document.getElementById("messageInput");
const list = document.getElementById("messagesList");

// Project 3 requirement: Fetch messages using Fetch API from GET /messages
async function fetchMessages() {
    try {
        // Project 3 requirement: Ajax request to retrieve messages from server API
        const response = await fetch(`${API_URL}/messages`);
        const messages = await response.json();
        
        // Project 3 requirement: Display messages in order given by server
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

// Project 3 requirement: Form submission handler
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const message = input.value.trim();
    if (!message) return;
    
    try {
        // Project 3 requirement: Send message using Fetch API to POST /messages
        await fetch(`${API_URL}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });
        
        input.value = "";
        // Project 3 requirement: Refresh list after server responds to POST request
        await fetchMessages();
    } catch (error) {
        alert("Error posting message");
    }
});

// Project 3 requirement: Load messages on page load
fetchMessages();
