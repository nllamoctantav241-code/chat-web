const socket = io();

let currentRoom = "";
let currentUser = "";

function joinRoom() {
    currentUser = document.getElementById("username").value;
    currentRoom = document.getElementById("room").value;

    if (!currentUser || !currentRoom) {
        alert("Completa nombre y sala");
        return;
    }

    socket.emit("joinRoom", {
        room: currentRoom,
        user: currentUser
    });

    document.getElementById("chat").style.display = "block";
}

function sendMessage() {
    const input = document.getElementById("messageInput");
    const message = input.value.trim();

    if (!message) return;

    socket.emit("chatMessage", {
        room: currentRoom,
        message: message,
        user: currentUser
    });

    input.value = "";
}

socket.on("message", (data) => {
    const messages = document.getElementById("messages");

    const div = document.createElement("div");
    div.textContent = `${data.user}: ${data.message}`;

    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
});

socket.on("chatHistory", (history) => {
    const messages = document.getElementById("messages");
    messages.innerHTML = "";

    history.forEach((msg) => {
        const div = document.createElement("div");
        div.textContent = `${msg.user}: ${msg.message}`;
        messages.appendChild(div);
    });

    messages.scrollTop = messages.scrollHeight;
});

socket.on("status", (text) => {
    const messages = document.getElementById("messages");

    const div = document.createElement("div");
    div.textContent = text;
    div.style.color = "green";

    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
});