<?php
// Initialize the session.
session_start();

// Start database connection.
require_once "../db/db_connection.php";
$conn = OpenCon(true);

$home_link = "Location: ../user_home.html?user=";

$is_self_call = isset($_POST['isself']);
$use_cache = !$is_self_call && !(isset($_GET['nocache']) && $_GET['nocache'] == true);;

// Check if user is already logged in using global session variables.
if ($use_cache && isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] == true) {
    header($home_link . $_SESSION["username"]);
    exit;
}

// Check if user is logged in using login log.
if ($use_cache) {
    $q = "SELECT U.id AS uid, U.username AS un FROM UserLogins UL INNER JOIN Users U on U.id = UL.user WHERE DATE(UL.login_time)=DATE(NOW())";
    $q_r = Query($conn, $q);
    if ($q_r->num_rows === 1) {
        $q_r = $q_r->fetch_row();
        $_SESSION["loggedin"] = true;
        $_SESSION["id"] = $q_r[0];
        $_SESSION["username"] = $q_r[1];

        // Redirect user to home page.
        header($home_link . $_SESSION["username"]);
    }
}

$username = $password = "";
$username_err = $password_err = "";

// Processing form data when form is submitted.
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Check if username is empty.
    if (empty(trim($_POST["username"]))) {
        $username_err = "Please enter username.";
    } else {
        $username = trim($_POST["username"]);
    }

    // Check if password is empty.
    if (empty(trim($_POST["password"]))) {
        $password_err = "Please enter your password.";
    } else {
        $password = trim($_POST["password"]);
    }

    // Validate credentials.
    if (empty($username_err) && empty($password_err)) {
        // Prepare a select statement
        $sql_q = "SELECT id, username, password FROM Users WHERE username = ?";

        if ($stmt = mysqli_prepare($conn, $sql_q)) {
            // Bind variables to the prepared statement as parameters.
            mysqli_stmt_bind_param($stmt, "s", $param_username);

            // Set parameters.
            $param_username = $username;

            // Attempt to execute the prepared statement.
            if (mysqli_stmt_execute($stmt)) {
                // Store result.
                mysqli_stmt_store_result($stmt);

                // Check if username exists, if yes then verify password.
                if (mysqli_stmt_num_rows($stmt) == 1) {
                    // Bind result variables.
                    mysqli_stmt_bind_result($stmt, $user_id, $username, $hashed_password);
                    if (mysqli_stmt_fetch($stmt)) {
                        if (password_verify($password, $hashed_password)) {
                            // Password is correct, so start a new session.
                            session_start();

                            // Store data in session variables.
                            $_SESSION["loggedin"] = true;
                            $_SESSION["id"] = $user_id;
                            $_SESSION["username"] = $username;

                            // Log login history.
                            $sql_q = "INSERT INTO `UserLogins` (`device`, `user`) VALUES ('{$_SERVER['REMOTE_ADDR']}', {$user_id})";
                            Query($conn, $sql_q);

                            // Redirect user to home page.
                            header($home_link . $_SESSION["username"]);
                        } else {
                            // Display an error message if password is not valid.
                            $password_err = "The password you entered was not valid.";
                        }
                    }
                } else {
                    // Display an error message if username doesn't exist.
                    $username_err = "No account found with that username.";
                }
            } else {
                echo "Oops! Something went wrong. Please try again later.";
            }

            // Close statement,
            mysqli_stmt_close($stmt);
        }
    }

    // Close connection.
    CloseCon($conn);
}
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="theme-color" content="#ffffff">

        <title>Login</title>

        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png">
        <link rel="manifest" href="/favicon/site.webmanifest">
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg">

        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.css">
        <link rel="stylesheet" href="login.css">
    </head>
    <body>
        <div class="wrapper">
            <h2>Enter Credentials</h2>
            <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
                <div class="form-group <?php echo (!empty($username_err)) ? 'has-error' : ''; ?>">
                    <label>Username</label>
                    <input type="text" name="username" class="form-control" value="<?php echo $username; ?>">
                    <span class="help-block"><?php echo $username_err; ?></span>
                </div>    
                <div class="form-group <?php echo (!empty($password_err)) ? 'has-error' : ''; ?>">
                    <label>Password</label>
                    <input type="password" name="password" class="form-control">
                    <span class="help-block"><?php echo $password_err; ?></span>
                </div>
                <input type="hidden" name="isself" value="true" />
                <div class="form-group">
                    <input type="submit" class="btn btn-primary" value="Login">
                </div>
                <p>Don't have an account? <a href="login_create.php">Sign up now</a>.</p>
            </form>
        </div>    
    </body>
</html>
