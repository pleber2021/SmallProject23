<?php

// IDK WHY BUT IT SAID INEEDED THIS?
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
// IDK WHY BUT IT SAID INEEDED THIS?

function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo json_encode($obj);
}

function returnWithError($err) {
    $retValue = ['contactID' => 0, 'error' => $err];
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($contactID) {
    $retValue = ['contactID' => $contactID, 'error' => ''];
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
    $contactFirstName = $inData["firstName"];
    $contactLastName = $inData["lastName"];
    $contactEmail = $inData["email"];
    $contactPhoneNumber = $inData["phoneNumber"];

    if (empty($userID) || empty($contactFirstName) || empty($contactLastName) || empty($contactEmail) || empty($contactPhoneNumber)) {
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

    $stmt = $conn->prepare("INSERT INTO contacts (userID, firstName, lastName, email, phoneNumber) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("issss", $userID, $contactFirstName, $contactLastName, $contactEmail, $contactPhoneNumber);
    $stmt->execute();

    $contactID = $stmt->insert_id;

    returnWithInfo($contactID);

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    returnWithError($e->getMessage());
}

?>