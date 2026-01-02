const form = document.getElementById("eventForm");
const table = document.getElementById("eventTable");

let events = JSON.parse(localStorage.getItem("events")) || [];

function saveEvents() {
  localStorage.setItem("events", JSON.stringify(events));
}

function renderEvents() {
  table.innerHTML = "";

  events.forEach((event, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${event.date} ${event.time}</td>
      <td>${event.title}</td>
      <td>${event.artists}</td>
      <td>${event.location}</td>
      <td><span class="delete" onclick="deleteEvent(${index})">Delete</span></td>
    `;

    table.appendChild(row);
  });
}

function deleteEvent(index) {
  events.splice(index, 1);
  saveEvents();
  renderEvents();
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const event = {
    title: title.value,
    artists: artists.value,
    date: date.value,
    time: time.value,
    location: location.value
  };

  events.push(event);
  saveEvents();
  renderEvents();
  form.reset();
});

renderEvents();



function updatePublicTheme() {
  const primary = document.getElementById("primary").value;
  const secondary = document.getElementById("secondary").value;

  fetch("/update-public-theme", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ primary, secondary })
  })
  .then(() => alert("Public theme updated"))
  .catch(err => console.error(err));
}
