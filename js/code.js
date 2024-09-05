const baseURL = 'https://ucf.red/API';

let userID = 0;
let firstName = "";
let lastName = "";

function login() {
    console.log("Login Started");

    userID = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("loginUsername").value;
    let password = document.getElementById("loginPassword").value;

    document.getElementById("loginStatus").innerHTML = "";

    let tmp = {login: login, password: password};

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

                    userID = jsonObject.id;

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
    let firstName = document.getElementById("signupFirstName").value;
    let lastName = document.getElementById("signupLastName").value;
    let email = document.getElementById("signupEmail").value;
    let phoneNumber = document.getElementById("signupPhoneNumber").value;

    document.getElementById("signupStatus").innerHTML = "";

    if (!username || !password || !firstName || !lastName || !email || !phoneNumber) {
        document.getElementById("signupStatus").innerHTML = "All fields are required!";
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

    try {
        xmlRequest.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {

                let jsonObject = JSON.parse(xmlRequest.responseText);

                if (jsonObject.error) {
                    document.getElementById("signupStatus").innerHTML = jsonObject.error;
                    return;
                }

                document.getElementById("signupStatus").innerHTML = "Account created successfully!";
                window.location.href = "login.html"; 
            }
        };

        xmlRequest.send(jsonAPIRequest); 
    } catch (err) {
        document.getElementById("signupStatus").innerHTML = err.message;
    }
}

function logout()
{
	userID = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "login.html";
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userID=" + userID + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userID = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userID" )
		{
			userID = parseInt( tokens[1].trim() );
		}
	}

	if( userID < 0 )
	{
		window.location.href = "login.html";
	}

}