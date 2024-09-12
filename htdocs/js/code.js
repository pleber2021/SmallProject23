userID = 0;
let firstName = "";
let lastName = "";
let loggedIn = false;

const baseURL = 'http://ucf.red/API';

window.onload = function() {
    console.log("Window onload");

    userID = readCookie("userID");
    firstName = readCookie("firstName");
    lastName = readCookie("lastName");
    loggedIn = readCookie("loggedIn");

    console.log("User ID: " + userID);
    console.log("First Name: " + firstName);
    console.log("Last Name: " + lastName);
    console.log("Logged In: " + loggedIn);

    if (loggedIn === "true" && window.location.pathname !== '/contacts.html') {
        console.log("Redirecting to contacts.html");
        window.location.href = "contacts.html";
    }
    if (loggedIn === "false") {
        console.log("Redirecting to index.html");
        window.location.href = "index.html";
    }

    if (window.location.pathname === '/contacts.html') {
        getContacts();
    }
};


function login() {
    console.log("Login Started");

    userID = 0;
    firstName = "";
    lastName = "";

    let username = document.getElementById("loginUsername").value;
    let password = document.getElementById("loginPassword").value;

    document.getElementById("loginStatus").innerHTML = "";

    let tmp = {username: username, password: password};

    let jsonAPIRequest = JSON.stringify(tmp);

    let url = baseURL + '/Login.php';

    let xmlRequest = new XMLHttpRequest();

    xmlRequest.open("POST", url, true);
    xmlRequest.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    console.log("Login Started 2");

    try {
        xmlRequest.onreadystatechange = function() {
            console.log("State changed: " + xmlRequest.readyState);
            console.log("Status: " + xmlRequest.status);

            if (this.readyState === 4) {
                console.log("ReadyState 4 reached");

                if (this.status === 200) {
                    console.log("Status 200 OK");

                    let jsonObject = JSON.parse(xmlRequest.responseText);
                    console.log("Response received: ", jsonObject);

                    userID = jsonObject.userID;

                    if (userID < 1) {
                        document.getElementById("loginStatus").innerHTML = "Please enter a valid username and password!";
                        return;
                    }

                    firstName = jsonObject.firstName;
                    lastName = jsonObject.lastName;

                    saveCookie();

                    window.location.href = "contacts.html";
                } else {
                    console.log("Error: Status " + this.status);
                    document.getElementById("loginStatus").innerHTML = "Login failed: " + this.statusText;
                }
            }
        };

        xmlRequest.send(jsonAPIRequest);
    } catch (err) {
        console.error("Caught error: ", err.message);
        document.getElementById("loginStatus").innerHTML = err.message;
    }

    console.log("Login Started 9");
}

function signup() {
    console.log("Sign Up Started");

    let username = document.getElementById("signupUsername").value;
    let password = document.getElementById("signupPassword").value;
    firstName = document.getElementById("signupFirstName").value;
    lastName = document.getElementById("signupLastName").value;
    let email = document.getElementById("signupEmail").value;
    let phoneNumber = document.getElementById("signupPhoneNumber").value;

    document.getElementById("signupStatus").innerHTML = "";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;

    if (!username || !password || !firstName || !lastName || !email || !phoneNumber) {
        document.getElementById("signupStatus").innerHTML = "All fields are required!";
        return;
    }

    if (!emailPattern.test(email)) {
        document.getElementById("signupStatus").innerHTML = "Please enter a valid email address!";
        return;
    }

    if (!phonePattern.test(phoneNumber)) {
        document.getElementById("signupStatus").innerHTML = "Please enter a valid phone number!";
        return;
    }

    let tmp = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,
        email: email,
        phoneNumber: phoneNumber
    };

    let jsonAPIRequest = JSON.stringify(tmp);

    let url = baseURL + '/Signup.php';

    let xmlRequest = new XMLHttpRequest();
    xmlRequest.open("POST", url, true);
    xmlRequest.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xmlRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            let jsonObject = JSON.parse(xmlRequest.responseText);

            if (jsonObject.error) {
                document.getElementById("signupStatus").innerHTML = jsonObject.error;
                return;
            }

            userID = jsonObject.userID;
            firstName = jsonObject.firstName;
            lastName = jsonObject.lastName;

            saveCookie();

            document.getElementById("signupStatus").innerHTML = "Account created!";

            window.location.href = "contacts.html";
        }
    };

    try {
        xmlRequest.send(jsonAPIRequest);
    } catch (err) {
        document.getElementById("signupStatus").innerHTML = err.message;
    }
}

function logout() {
    document.cookie = "userID=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "firstName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "lastName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

    window.location.href = "index.html";
}


function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));  

    let secureFlag = window.location.protocol === 'https:' ? ";Secure" : "";
    let cookieOptions = `;expires=${date.toUTCString()};path=/;SameSite=Lax${secureFlag}`;

    document.cookie = "userID=" + userID + cookieOptions;
    document.cookie = "firstName=" + firstName + cookieOptions;
    document.cookie = "lastName=" + lastName + cookieOptions;
    document.cookie = "loggedIn=true" + cookieOptions;
}


function readCookie() {
    userID = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        } else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        } else if (tokens[0] == "userID") {
            userID = parseInt(tokens[1].trim());
        }
    }

    if (userID < 0) {
        window.location.href = "index.html";
    }
}

function readCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}


function checkLoginStatus() {
    const loggedIn = readCookie("loggedIn");

    if (loggedIn !== "true") {
        window.location.href = "index.html";
    }
}


function addContact() {
    firstName = document.getElementById("contactFirstName").value;
    lastName = document.getElementById("contactLastName").value;
    let email = document.getElementById("contactEmail").value;
    let phoneNumber = document.getElementById("contactPhoneNumber").value;
    userID = getUserIDFromCookie();

    let contactData = {
        userID: userID,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber
    };

    let jsonAPIRequest = JSON.stringify(contactData);

    let url = baseURL + '/AddContact.php';

    let xmlRequest = new XMLHttpRequest();
    xmlRequest.open("POST", url, true);
    xmlRequest.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xmlRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let jsonResponse = JSON.parse(xmlRequest.responseText);
            if (jsonResponse.error) {
                showContactStatus(jsonResponse.error);
            } else {
                showContactStatus("Contact added!");

                let contactID = jsonResponse.contactID;  

                let contactsTableBody = document.getElementById("contacts").getElementsByTagName('tbody')[0];
                let row = contactsTableBody.insertRow();
                row.id = `contactRow_${contactID}`;

                // Format the phone number before inserting it
                let formattedPhoneNumber = formatPhoneNumber(phoneNumber);

                row.insertCell(0).innerText = firstName;
                row.insertCell(1).innerText = lastName;
                row.insertCell(2).innerText = email;
                row.insertCell(3).innerText = formattedPhoneNumber;  // Use formatted phone number

                let actionCell = row.insertCell(4);
                actionCell.innerHTML = `
                    <button class="edit-btn" onclick="editContact(${contactID})">Edit</button>
                    <button class="remove-btn" onclick="removeContact(${contactID})">Remove</button>
                `;

                document.getElementById("contactFirstName").value = "";
                document.getElementById("contactLastName").value = "";
                document.getElementById("contactEmail").value = "";
                document.getElementById("contactPhoneNumber").value = "";

                closeModal();
            }
        }
    };

    xmlRequest.send(jsonAPIRequest);
}



function removeContact(contactID) {
    userID = getUserIDFromCookie();

    let contactData = {
        userID: userID,
        contactID: contactID
    };

    let jsonAPIRequest = JSON.stringify(contactData);

    let url = baseURL + '/RemoveContact.php';

    let xmlRequest = new XMLHttpRequest();
    xmlRequest.open("POST", url, true);
    xmlRequest.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xmlRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let jsonResponse = JSON.parse(xmlRequest.responseText);
            if (jsonResponse.error) {
                showContactStatus(jsonResponse.error);
            } else {
                document.getElementById(`contactRow_${contactID}`).remove();
                showContactStatus("Contact removed!");
            }
        }
    };

    xmlRequest.send(jsonAPIRequest);
}
function editContact(contactID) {
    let row = document.getElementById(`contactRow_${contactID}`);

    let firstNameCell = row.cells[0];
    let lastNameCell = row.cells[1];
    let emailCell = row.cells[2];
    let phoneNumberCell = row.cells[3];
    let actionCell = row.cells[4];

    if (actionCell.innerHTML.includes("Save")) {

        let updatedFirstName = firstNameCell.querySelector("input").value;
        let updatedLastName = lastNameCell.querySelector("input").value;
        let updatedEmail = emailCell.querySelector("input").value;
        let updatedPhoneNumber = phoneNumberCell.querySelector("input").value;

        let userID = getUserIDFromCookie();

        let contactData = {
            userID: userID,
            contactID: contactID,
            firstName: updatedFirstName,
            lastName: updatedLastName,
            email: updatedEmail,
            phoneNumber: updatedPhoneNumber
        };

        let jsonAPIRequest = JSON.stringify(contactData);

        let url = baseURL + '/EditContact.php';

        let xmlRequest = new XMLHttpRequest();
        xmlRequest.open("POST", url, true);
        xmlRequest.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        xmlRequest.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let jsonResponse = JSON.parse(xmlRequest.responseText);
                if (jsonResponse.error) {
                    showContactStatus(jsonResponse.error);
                } else {
                    showContactStatus("Contact updated!");

                    firstNameCell.innerHTML = updatedFirstName;
                    lastNameCell.innerHTML = updatedLastName;
                    emailCell.innerHTML = updatedEmail;
                    phoneNumberCell.innerHTML = formatPhoneNumber(updatedPhoneNumber); 

                    actionCell.innerHTML = `
                        <button class="edit-btn" onclick="editContact(${contactID})">Edit</button>
                        <button class="remove-btn" onclick="removeContact(${contactID})">Remove</button>
                    `;
                }
            }
        };

        xmlRequest.send(jsonAPIRequest);

    } else {

        firstNameCell.innerHTML = `<input type="text" value="${firstNameCell.innerText}">`;
        lastNameCell.innerHTML = `<input type="text" value="${lastNameCell.innerText}">`;
        emailCell.innerHTML = `<input type="email" value="${emailCell.innerText}">`;

        let rawPhoneNumber = phoneNumberCell.innerText.replace(/\D/g, ''); 
        phoneNumberCell.innerHTML = `<input type="text" value="${rawPhoneNumber}">`;

        actionCell.innerHTML = `
            <button class="save-btn" onclick="editContact(${contactID})">Save</button>
            <button class="remove-btn" onclick="removeContact(${contactID})">Remove</button>
        `;
    }
}

function getUserIDFromCookie() {

    const name = "userID=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }

    return null;
}

function formatPhoneNumber(phoneNumber) {

    let cleaned = ('' + phoneNumber).replace(/\D/g, '');

    if (cleaned.length === 10) {
        let part1 = cleaned.slice(0, 3);
        let part2 = cleaned.slice(3, 6);
        let part3 = cleaned.slice(6, 10);

        return `(${part1}) ${part2}-${part3}`;
    }

    return phoneNumber;
}

function showContactStatus(message) {
    var statusElement = document.getElementById('contactStatus');
    statusElement.textContent = message;
    statusElement.style.display = 'block'; 
    statusElement.style.opacity = '1'; 

    setTimeout(function() {
        statusElement.style.opacity = '0'; 
       scrollX
        setTimeout(function() {
            statusElement.style.display = 'none';
        }, 500); 
    }, 5000);
}

let allContacts = []; 

function getContacts() {
    console.log("Getting contacts...");
    userID = getUserIDFromCookie();
    let contactData = { userID: userID };

    let jsonAPIRequest = JSON.stringify(contactData);

    let url = baseURL + '/GetContacts.php';  

    let xmlRequest = new XMLHttpRequest();
    xmlRequest.open("POST", url, true);
    xmlRequest.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xmlRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let jsonResponse = JSON.parse(xmlRequest.responseText);
            allContacts = jsonResponse.contacts; 

            displayContacts(allContacts); 
        }
    };

    xmlRequest.send(jsonAPIRequest);
}

function displayContacts(contacts) {
    let contactsTableBody = document.getElementById("contacts").getElementsByTagName('tbody')[0];
    contactsTableBody.innerHTML = ""; 

    contacts.forEach(contact => {
        let row = contactsTableBody.insertRow();
        row.id = `contactRow_${contact.contactID}`;

      
        let date = new Date(contact.dateCreated);
        let formattedDate = formatFullDate(date);

       
        row.insertCell(0).innerText = contact.firstName;
        row.cells[0].setAttribute('data-title', `Date Created: ${formattedDate}`);

        
        row.insertCell(1).innerText = contact.lastName;
        row.cells[1].setAttribute('data-title', `Date Created: ${formattedDate}`);

       
        row.insertCell(2).innerText = contact.email;
        row.cells[2].setAttribute('data-title', `Date Created: ${formattedDate}`);

       
        let formattedPhoneNumber = formatPhoneNumber(contact.phoneNumber);
        row.insertCell(3).innerText = formattedPhoneNumber;
        row.cells[3].setAttribute('data-title', `Date Created: ${formattedDate}`);

       
        let actionCell = row.insertCell(4);
        actionCell.innerHTML = `
            <button class="edit-btn" onclick="editContact(${contact.contactID})">Edit</button>
            <button class="remove-btn" onclick="removeContact(${contact.contactID})">Remove</button>
        `;
    });
}


function formatFullDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}



function search() {
    let searchTerm = document.getElementById("contactSearch").value.toLowerCase(); 
    let filteredContacts = allContacts.filter(contact => {
        return contact.firstName.toLowerCase().includes(searchTerm) || contact.lastName.toLowerCase().includes(searchTerm);
    });

    displayContacts(filteredContacts); 
}
function validateSignup()
{
    var username = document.getElementById("signupUsername");
    var UerrorMessage = document.getElementById('susername-error');
    UerrorMessage.textContent = '';
    UerrorMessage.style.display = 'none';

    // Validate the password field (example validation)
    if (username.value.trim() === '') {
        UerrorMessage.textContent = 'Username is required.';
        UerrorMessage.style.display = 'block';
}
    var password = document.getElementById("signupPassword");
    var PerrorMessage = document.getElementById('spassword-error');  
    PerrorMessage.textContent = '';
    PerrorMessage.style.display = 'none';
    if(password.value.trim() === ''){
        PerrorMessage.textContent = 'Password is required.';
        PerrorMessage.style.display = 'block';
    }
    var firstName = document.getElementById("signupFirstName");
    var FerrorMessage = document.getElementById('sfirstname-error');
    FerrorMessage.textContent = '';
    FerrorMessage.style.display = 'none';
    if(firstName.value.trim() === ''){
        FerrorMessage.textContent = 'First Name is required.';
        FerrorMessage.style.display = 'block';
    }
    var lastName = document.getElementById("signupLastName");
    var errorMessage = document.getElementById('slastname-error');
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
    if(lastName.value.trim() === ''){
        errorMessage.textContent = 'Last Name is required.';
        errorMessage.style.display = 'block';
    }
    var email = document.getElementById("signupEmail");
    var errorMessage = document.getElementById('semail-error');
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
    if(email.value.trim() === ''){
        errorMessage.textContent = 'Email is required.';
        errorMessage.style.display = 'block';
    }
    var phoneNumber = document.getElementById("signupPhoneNumber");
    var errorMessage = document.getElementById('sphonenumber-error');
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
    if(phoneNumber.value.trim() === ''){
        errorMessage.textContent = 'Phone Number is required.';
        errorMessage.style.display = 'block';
    }

    

    

    

}
function validateLogin(){
    var usernameField = document.getElementById('loginUsername');
    var errorMessage = document.getElementById('username-error');

            // Clear previous error message
            errorMessage.textContent = '';
            errorMessage.style.display = 'none';

            // Validate the username field (example validation)
            if (usernameField.value.trim() === '') {
                errorMessage.textContent = 'Username is required.';
                errorMessage.style.display = 'block';
            }
    var passwordField = document.getElementById('loginPassword');
    var errorMessage = document.getElementById('password-error');

            // Clear previous error message
            errorMessage.textContent = '';
            errorMessage.style.display = 'none';

            // Validate the password field (example validation)
            if (passwordField.value.trim() === '') {
                errorMessage.textContent = 'Password is required.';
                errorMessage.style.display = 'block';
            }

}