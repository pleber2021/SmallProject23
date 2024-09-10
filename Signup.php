<?php


    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $username = $inData["username"];
    $password = $inData["password"];
    $email = $inData["email"];
    $phoneNumber = $inData["phoneNumber"];

    $conn = new mysqli("localhost", "SmallProjectManager", "SPM", "SmallProject");

    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } else {

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            returnWithError("Please enter a valid email address!");
        } else {

            $stmt = $conn->prepare("SELECT userID FROM accounts WHERE username = ?");
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                returnWithError("Username already taken!");
            } else {
                $stmt = $conn->prepare("INSERT INTO accounts (firstName, lastName, username, password, email, phoneNumber) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->bind_param("ssssss", $firstName, $lastName, $username, $password, $email, $phoneNumber);

                if ($stmt->execute()) {
                    returnWithInfo($firstName, $lastName, $conn->insert_id); 
                } else {
                    returnWithError("Failed to create account!");
                }
            }
        }

        $stmt->close();
        $conn->close();
    }

    function getRequestInfo() {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj) {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err) {
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($firstName, $lastName, $id) {
        $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
        sendResultInfoAsJson($retValue);
    }
?>