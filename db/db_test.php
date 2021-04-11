<?php
include 'db_connection.php';
$conn = OpenCon(true);
echo "Connected To DB";

// $q = 'CREATE TABLE Users (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, username VARCHAR(50) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);';

//$q = 'SELECT AUTO_INCREMENT FROM information_schema.tables WHERE table_name = "Users" AND table_schema = database();';

//$q = 'INSERT INTO Users (username, password, created_at) VALUES ("mirh", "$2y$10$As/c08f6f0jYs6K3N.hCQuwIi/x7zjTJIm2nYszqf1iyVP.MGqjai", "2021-03-10 05:16:40");';

$q = 'SELECT * FROM Users;';
//$q = 'SELECT * FROM Jobs;';
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
