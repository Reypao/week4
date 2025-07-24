// Grid/List toggle
const directory = document.getElementById("directory");
const gridBtn = document.getElementById("gridView");
const listBtn = document.getElementById("listView");

gridBtn.addEventListener("click", () => {
  directory.classList.add("grid");
  directory.classList.remove("list");
  getMembers();
});
listBtn.addEventListener("click", () => {
  directory.classList.add("list");
  directory.classList.remove("grid");
  getMembers();
});

// Fetch and display member data
async function getMembers() {
  try {
    const response = await fetch("data/members.json");
    const members = await response.json();
    displayMembers(members);
  } catch (error) {
    console.error("Error loading members:", error);
  }
}

function displayMembers(members) {
  const directory = document.getElementById("directory");
  directory.innerHTML = "";

  if (directory.classList.contains("list")) {
    // LIST VIEW
    const table = document.createElement("table");
    table.classList.add("directory-table");

    table.innerHTML = `
      <thead>
        <tr>          
          <th>Name</th>
          <th>Phone</th>
          <th>Website</th>
        </tr>
      </thead>
      <tbody>
        ${members
          .map(
            (member) => `
          <tr>            
            <td>${member.name}</td>
            <td>${member.phone}</td>
            <td><a href="${member.website}" target="_blank">${member.website}</a></td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    `;

    directory.appendChild(table);
  } else {
    // GRID VIEW (cards)
    members.forEach((member) => {
      const card = document.createElement("div");
      card.classList.add("directory-card");
      card.innerHTML = `
        <h4>${member.name}</h4>
        <p class="tagline">${member.membership} Member</p>
        <hr>
        <div class="business-content">
          <div class="logo-wrapper">
            <img src="images/${member.image}" alt="${member.name} Logo">
          </div>
          <div class="business-info">
            <p><span>Email:</span> ${member.email}</p>
            <p><span>Phone:</span> ${member.phone}</p>
            <p><span>URL:</span> <a href="${member.website}" target="_blank">${member.website}</a></p>
          </div>
        </div>
      `;
      directory.appendChild(card);
    });
  }
}

getMembers();
