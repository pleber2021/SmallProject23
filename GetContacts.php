<?php


function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo json_encode($obj);
}

$inData = getRequestInfo();

$userID = $inData['userID'];

$conn = new mysqli("localhost", "SmallProjectManager", "SPM", "SmallProject");

if ($conn->connect_error) {
    sendResultInfoAsJson(["error" => $conn->connect_error]);
    exit();
}

$stmt = $conn->prepare("SELECT contactID, firstName, lastName, email, phoneNumber FROM contacts WHERE userID = ?");
$stmt->bind_param("i", $userID);
$stmt->execute();
$result = $stmt->get_result();

$contacts = [];
while ($row = $result->fetch_assoc()) {
    $contacts[] = $row;
}

$stmt->close();
$conn->close();

sendResultInfoAsJson(["contacts" => $contacts, "error" => ""]);

?>