<?php


function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo json_encode($obj);
}

function returnWithError($err) {
    $retValue = ['id' => 0, 'firstName' => '', 'lastName' => '', 'error' => $err];
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($firstName, $lastName, $id) {
    $retValue = ['id' => $id, 'firstName' => $firstName, 'lastName' => $lastName, 'error' => ''];
    sendResultInfoAsJson($retValue);
}

try {

    $inData = getRequestInfo();

    $id = 0;
    $firstName = "";
    $lastName = "";

    $conn = new mysqli("localhost", "SmallProjectManager", "SPM", "SmallProject");

    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    $stmt = $conn->prepare("SELECT userID, firstName, lastName, password FROM accounts WHERE username = ? AND password = ?");
    $stmt->bind_param("ss", $inData["username"], $inData["password"]); 
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        returnWithInfo($row['firstName'], $row['lastName'], $row['userID']);
    } else {
        returnWithError("User Not Found");
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {

    returnWithError($e->getMessage());
}

?>