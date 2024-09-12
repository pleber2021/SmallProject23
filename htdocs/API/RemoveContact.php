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

try {
    $inData = getRequestInfo();

    $userID = $inData['userID'];
    $contactID = $inData['contactID'];

    $conn = new mysqli("localhost", "SmallProjectManager", "SPM", "SmallProject");

    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    $stmt = $conn->prepare("DELETE FROM contacts WHERE contactID = ? AND userID = ?");
    $stmt->bind_param("ii", $contactID, $userID);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        returnWithSuccess();
    } else {
        returnWithError("Failed to find contact!");
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    returnWithError($e->getMessage());
}

?>
