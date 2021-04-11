<?php
include 'db_connection.php';
$conn = OpenCon(true);
echo "Connected To DB";

// $q = 'CREATE TABLE UserLogins (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, user INT NOT NULL, login_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, device TINYTEXT, FOREIGN KEY (user) REFERENCES Users(id));';

//$q = 'SELECT AUTO_INCREMENT FROM information_schema.tables WHERE table_name = "Users" AND table_schema = database();';

//$q = 'INSERT INTO Users (username, password, created_at) VALUES ("mirh", "$2y$10$As/c08f6f0jYs6K3N.hCQuwIi/x7zjTJIm2nYszqf1iyVP.MGqjai", "2021-03-10 05:16:40");';

//$q = 'SELECT * FROM Jobs;';
$q = 'SELECT * FROM Users;';
//$q = 'SELECT * FROM UserLogins;';
?>
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
    </head>
    <body>
        <?php
        echo "<br>";
        $result = Query($conn, $q);
        echo "<br>";
        echo print_r($result);
        echo "<br>";
        while ($r = $result->fetch_row()) {
            echo "<br>";
            print_r($r);
            echo "<br>";
            foreach ($r as $v) {
                echo '|' . $v . '|';
                echo "<br>";
            }
        }
        $result->close();
        ?>
    </body>
</html>

<?php
CloseCon($conn);
?>
