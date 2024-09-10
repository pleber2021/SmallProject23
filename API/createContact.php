<?php
  include 'db.php';
error_reporting(E_ALL);
ini_set('display_errors', 1);

  $lastname = $_POST["lastname"];
  $firstname = $_POST["firstname"];
  $email = $_POST["email"];
  $phoneNumber = $_POST["phoneNumber"];
  $sql = "insert into contacts (firstname,lastname,email,phoneNumber) values ('$firstname','$lastname', '$email', '$phoneNumber')";
  $conn->query($sql);
  $conn->close();
  header("location: ../contactList2.php");
?>
