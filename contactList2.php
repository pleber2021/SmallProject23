<!DOCTYPE html>
<html>
<head>
   <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
   <style>
       .form-inline .form-group {
           display: flex;
           flex-direction: column;
           margin-right: 10px;
       }

       .form-inline .form-group label {
           margin-bottom: 5px;
       }

       table {
           margin-top: 20px;
       }

       th, td {
           text-align: center;
       }
   </style>
</head>
<body>
<div class="topnav">
    <a class="active" href="home">Home</a>
    <a href="#home">About</a>
    <a href="#logout">Logout</a>
</div>

<div class="container">
    <h1>Contact List</h1>
    <p>Create, read, update, and delete records below</p>

    <form class="form-inline m-2" action="search.php" method="GET">
        <input type="text" class="form-control m-2" id="search" name="search" placeholder="Search Name, Email, or #" value="<?php echo isset($_GET['search']) ? htmlspecialchars($_GET['search']) : ''; ?>">
        <button type="submit" class="btn btn-primary">Search</button>
    </form>

    <table class="table table-bordered">
        <thead>
            <tr>
                
                <th> First Name</th>
                <th> Last Name</th>
                <th>Email</th>
                <th>Phone Number</th>
            </tr>
        </thead>
        <tbody>
            <?php include 'API/readContact.php'; ?>
        </tbody>
    </table>

    <form class="form-inline m-2" action="API/createContact.php" method="POST">
        <div class="form-group">
            <label for="firstname">First Name:</label>
            <input type="text" class="form-control" id="firstname" name="firstname" required>
        </div>
        <div class="form-group">
            <label for="lastname">Last Name:</label>
            <input type="text" class="form-control" id="lastname" name="lastname" required>
        </div>
        <div class="form-group">
            <label for="email">Email:</label>
            <input type="text" class="form-control" id="email" name="email" required>
        </div>
        <div class="form-group">
            <label for="phoneNumber">Phone Number:</label>
            <input type="text" class="form-control" id="phoneNumber" name="phoneNumber">
        </div>
        <button type="submit" class="btn btn-primary">Add!</button>
    </form>
</div>
</body>
</html>
