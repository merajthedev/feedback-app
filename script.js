async function sendFeedback() {
  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;

  if (!name || !message) {
    alert("Please fill all fields");
    return;
  }

  await fetch("/api/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, message })
  });

  document.getElementById("name").value = "";
  document.getElementById("message").value = "";

  loadFeedback();
}

async function loadFeedback() {
  const res = await fetch("/api/feedback");
  const data = await res.json();

  const list = document.getElementById("list");
  list.innerHTML = "";

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<b>${item.name}</b><p>${item.message}</p>`;
    list.appendChild(div);
  });
}

loadFeedback();