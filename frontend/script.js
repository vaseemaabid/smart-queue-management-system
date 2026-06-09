const API = "http://localhost:5000";

async function bookToken() {

    const name = document.getElementById("name").value;

    if (!name) {
        alert("Please enter your name");
        return;
    }

    const response = await fetch(`${API}/book-token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
    });

    const data = await response.json();

    document.getElementById("result").innerHTML =
        `Your Token Number: ${data.tokenNumber}`;

    loadQueue();
}

async function loadQueue() {

    const response = await fetch(`${API}/queue`);

    const queue = await response.json();

    let html = "";

    queue.forEach(token => {
        html += `
        <li>
            Token ${token.tokenNumber} - ${token.name}
        </li>`;
    });

    document.getElementById("queueList").innerHTML = html;
}

loadQueue();
