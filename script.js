const apiEndpoint =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
const pageSize = 10;
let currentPage = 1;
let currentData = [];

// DOM elements
const usersTable = document.getElementById("users");
const pageNumEl = document.getElementById("page-num");

// Delete name as per requirement using API
const usersUrl =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

let users = [];

// Retrieve data from API and parse response
fetch(usersUrl)
  .then((response) => response.json())
  .then((data) => {
    users = data;
    renderUsers();
  });

// Render users in HTML
function renderUsers() {
  const tbody = document.getElementById("users");
  tbody.innerHTML = "";
  for (const user of users) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="checkbox" name="select-user" value="${user.id}"/></td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td><button class="delete-user" data-id="${user.id}">Delete</button></td>
    `;
    tbody.appendChild(tr);
  }
}

// Delete selected users
const deleteSelectedBtn = document.getElementById("delete-selected");
deleteSelectedBtn.addEventListener("click", () => {
  const selectedCheckboxes = document.querySelectorAll(
    'input[name="select-user"]:checked'
  );
  selectedCheckboxes.forEach((checkbox) => {
    const userId = checkbox.value;
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex >= 0) {
      fetch(`${usersUrl}/${userId}`, { method: "DELETE" });
      users.splice(userIndex, 1);
    }
  });
  renderUsers();
});

// Delete single user
const tbody = document.getElementById("users");
tbody.addEventListener("click", (event) => {
  if (event.target.matches(".delete-user")) {
    const userId = event.target.getAttribute("data-id");
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex >= 0) {
      fetch(`${usersUrl}/${userId}`, { method: "DELETE" });
      users.splice(userIndex, 1);
      renderUsers();
    }
  }
});

// Search Name as per requrement using API [Bootstrap]

// Get the input element and the table body element
// Retrieve the search input element and the user list tbody element
const searchInput = document.querySelector('input[type="text"]');
const userList = document.querySelector("#users");

// Retrieve the user data from the endpoint
fetch(
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
)
  .then((response) => response.json())
  .then((users) => {
    // Display all users initially
    displayUsers(users);

    // Add an event listener to the search input to filter the users based on the search query
    searchInput.addEventListener("input", (event) => {
      const query = event.target.value.toLowerCase();
      const filteredUsers = users.filter((user) => {
        const name = user.name.toLowerCase();
        const email = user.email.toLowerCase();
        return name.includes(query) || email.includes(query);
      });
      displayUsers(filteredUsers);
    });
  })
  .catch((error) => {
    console.error(error);
  });

// Function to display the users in the list
function displayUsers(users) {
  let html = "";
  for (const user of users) {
    html += `
      <tr>
        <td><input type="checkbox" /></td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td><button>Delete</button></td>
      </tr>
    `;
  }
  userList.innerHTML = html;
}

// Add event listener to the input element to update the table on input change
searchInput.addEventListener("input", updateTable);

// Initial table update
updateTable();

// Fetch data from API
fetch(apiEndpoint)
  .then((response) => response.json())
  .then((data) => {
    currentData = data;
    renderTable(currentPage);
  })
  .catch((error) => console.error(error));

// Render the table with the current page data
function renderTable(page) {
  // Clear the current table
  usersTable.innerHTML = "";

  // Get the data for the current page
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageData = currentData.slice(start, end);

  // Loop through the data and add rows to the table
  for (let i = 0; i < pageData.length; i++) {
    const user = pageData[i];

    const row = document.createElement("tr");

    // Checkbox column
    const checkboxCell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkboxCell.appendChild(checkbox);
    row.appendChild(checkboxCell);

    // Name column
    const nameCell = document.createElement("td");
    nameCell.textContent = user.name;
    row.appendChild(nameCell);

    // Email column
    const emailCell = document.createElement("td");
    emailCell.textContent = user.email;
    row.appendChild(emailCell);

    // Role column
    const roleCell = document.createElement("td");
    roleCell.textContent = user.role;
    row.appendChild(roleCell);

    // Action column
    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);

    usersTable.appendChild(row);
  }

  // Update the page number display
  const totalPageNum = Math.ceil(currentData.length / pageSize);
  pageNumEl.textContent = `Page ${page} of ${totalPageNum}`;
}

// Pagination button click handlers
document.getElementById("first-page").addEventListener("click", () => {
  currentPage = 1;
  renderTable(currentPage);
});

document.getElementById("prev-page").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable(currentPage);
  }
});

document.getElementById("next-page").addEventListener("click", () => {
  const totalPageNum = Math.ceil(currentData.length / pageSize);
  if (currentPage < totalPageNum) {
    currentPage++;
    renderTable(currentPage);
  }
});

document.getElementById("last-page").addEventListener("click", () => {
  const totalPageNum = Math.ceil(currentData.length / pageSize);
  currentPage = totalPageNum;
  renderTable(currentPage);
});
