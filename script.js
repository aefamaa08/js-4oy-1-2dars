const url = "https://67cafd683395520e6af3e8eb.mockapi.io/api/users";
const userList = document.getElementById("contacts");

async function addContact() {
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("number").value.trim();

    if (name === "" || phone === "") {
        alert("введите что то");
        return;
    }

    const newContact = { name, phone };

    try {
        let res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newContact)
        });

        let savedUser = await res.json();
        addUserToUI(savedUser);

        document.getElementById("name").value = "";
        document.getElementById("number").value = "";
    } catch (error) {
        console.error("ошибка", error);
    }
}

function addUserToUI(user) {
    let li = document.createElement("li");
    li.innerHTML = `
        <span id="name-${user.id}">${user.name}</span>
        <span id="phone-${user.id}">${user.phone}</span>
        <button onclick="editUser('${user.id}')">🖋️</button>
        <button onclick="deleteUser('${user.id}', this)">❌</button>
    `;
    userList.appendChild(li);
}

async function editUser(id) {
    let nameSpan = document.getElementById(`name-${id}`);
    let phoneSpan = document.getElementById(`phone-${id}`);

    let newName = prompt("новое имя:", nameSpan.innerText);
    let newPhone = prompt("введите новый номер:", phoneSpan.innerText);

    if (newName && newName.trim() !== "" && newPhone && newPhone.trim() !== "") {
        try {
            await fetch(`${url}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName, phone: newPhone })
            });

            nameSpan.innerText = newName;
            phoneSpan.innerText = newPhone;
        } catch (error) {
            console.error("ошибка:", error);
        }
    }
}

async function deleteUser(id, button) {
    try {
        await fetch(`${url}/${id}`, { method: "Delete" });
        button.parentElement.remove();
    } catch (error) {
        console.error("ошибка:", error);
    }
}

document.addEventListener("DOMContentLoaded", getUsers);

async function getUsers() {
    try {
        let res = await fetch(url);
        let users = await res.json();
        userList.innerHTML = "";
        users.forEach(user => addUserToUI(user));
    } catch (error) {
        console.error("ошибка:", error);
    }
}



