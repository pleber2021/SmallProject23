<?php

include 'db.php';
$sql = "select * from contacts";
$result = $conn->query($sql);
while ($row = $result->fetch_assoc())
{
echo "<tr>";




if ($row['contactID'] == $_GET['contactID']) {
      echo '<form class="form-inline m-2" action="update.php" method="POST">';
      echo '<td><input type="text" class="form-control" name="firstname" value="'.$row['firstname'].'"></td>';
      echo '<td><input type="text" class="form-control" name="lastname" value="'.$row['lastname'].'"></td>';
      echo '<td><input type="text" class="form-control" name="email" value="'.$row['email'].'"></td>';
      echo '<td><input type="text" class="form-control" name="phoneNumber" value="'.$row['phoneNumber'].'"></td>';
      echo '<td><button type="submit" class="btn btn-primary">Save</button></td>';
      echo '<input type="hidden" name="contactID" value="'.$row['contactID'].'">';
      echo '</form>';
    } else {
     	        echo "<td>" . $row['firstname'] . "</td>";
		echo "<td>" . $row['lastname'] . "</td>";
                echo "<td>" . $row['email'] . "</td>";
                echo "<td>" . $row['phoneNumber'] . "</td>";
                echo '<td><a class="btn btn-primary" href="../contactList2.php?id=' . $row['contactID'] . '" role="button">Update!</a></td>';
    }
echo '<td><a class="btn btn-danger" href="delete.php?id=' . $row['contactID'] . '" role="button">Delete!</a></td>';

echo "</tr>";

}
$conn->close();

?>
