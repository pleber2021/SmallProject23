<?php

    header("Access-Control-Allow-Origin: *");

    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

    header("Access-Control-Allow-Headers: Content-Type, Authorization");

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

        http_response_code(200);
        exit();
    }

    $inData = getRequestInfo();

    $id = 0;
    $firstName = "";
    $lastName = "";

    $conn = new mysqli("localhost", "SmallProjectManager", "SPM", "SmallProject");

    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } else {

        $stmt = $conn->prepare("SELECT userID, firstName, lastName FROM accounts WHERE username = ? AND password = ?");
        $stmt->bind_param("ss", $inData["username"], $inData["password"]);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            returnWithInfo($row['firstName'], $row['lastName'], $row['userID']);
        } else {
            returnWithError("No Records Found");
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