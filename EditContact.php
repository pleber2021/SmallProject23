<?php



function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo json_encode($obj);
}

function returnWithError($err) {
    $retValue = ['error' => $err];
    sendResultInfoAsJson($retValue);
}

function returnWithSuccess() {
    $retValue = ['error' => ''];
    sendResultInfoAsJson($retValue);
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validatePhoneNumber($phoneNumber) {

    return preg_match("/^[0-9]{10}$/", $phoneNumber);
}

try {
    $inData = getRequestInfo();

    $userID = $inData["userID"];
    $contactID = $inData["contactID"];
    $contactFirstName = $inData["firstName"];
    $contactLastName = $inData["lastName"];
    $contactEmail = $inData["email"];
    $contactPhoneNumber = $inData["phoneNumber"];

    if (empty($userID) || empty($contactID) || empty($contactFirstName) || empty($contactLastName) || empty($contactEmail) || empty($contactPhoneNumber)) {
        returnWithError("All fields are required!");
        exit();
    }

    if (!validateEmail($contactEmail)) {
        returnWithError("Please enter a valid email address!");
        exit();
    }

    if (!validatePhoneNumber($contactPhoneNumber)) {
        returnWithError("Please enter a valid phone number!");
        exit();
    }

    $conn = new mysqli("localhost", "SmallProjectManager", "SPM", "SmallProject");

    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    $checkStmt = $conn->prepare("SELECT * FROM contacts WHERE contactID = ? AND userID = ?");
    $checkStmt->bind_param("ii", $contactID, $userID);
    $checkStmt->execute();
    $result = $checkStmt->get_result();

    if ($result->num_rows > 0) {

        $stmt = $conn->prepare("UPDATE contacts SET firstName = ?, lastName = ?, email = ?, phoneNumber = ? WHERE contactID = ? AND userID = ?");
        $stmt->bind_param("ssssii", $contactFirstName, $contactLastName, $contactEmail, $contactPhoneNumber, $contactID, $userID);
        $stmt->execute();

        if ($stmt->affected_rows >= 0) {
            returnWithSuccess(); 
        } else {
            returnWithError("Failed to update contact!");
        }

        $stmt->close();
    } else {
        returnWithError("Failed to find contact!");
    }

    $checkStmt->close();
    $conn->close();

} catch (Exception $e) {
    returnWithError($e->getMessage());
}

?>