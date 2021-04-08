<!DOCTYPE html>
<?php
$local_dir_head = '/home/dp/NetBeansProjects/musicAILocalSite/';
$local_dir_tail = 'data_files/';
$supported_extensions = array(".mid", '.midi');
?>

<?php

function startsWith($str, $search) {
    return substr_compare($str, $search, 0, strlen($search)) === 0;
}

function endsWith($str, $search) {
    return substr_compare($str, $search, -strlen($search)) === 0;
}

function handleError($err) {
    die($err . '<br><br><a href="https://musicai.app/login/login.php">Go back to dashboard</a>');
}
?>

<html>
    <head>
        <title> Process Input </title>
    </head>
    <body>
        <?php
        # var_dump($_FILES['file']);
        # 
        # Validate for inputs.
        $usr = $_POST['user'];
        if (!$usr) {
            handleError('A job must be associated with a user! Try logging in again!');
        }
        $n_files = count($_FILES['file']['name']);
        if (!$n_files) {
            handleError('No files given!');
        }

        # Santiy check file sizes and extensions.
        for ($i = 0; $i < count($_FILES['file']['name']); $i++) {
            $f_n = $_FILES['file']['name'][$i];
            $f_s = $_FILES['file']['size'][$i];

            if ($f_s > 1024 * 1024) {
                handleError('ERR: file {' . $f_n . '} is too large {' . $f_s . ' bytes}');
            }

            $f_extensions = array_map(function($s) use($f_n) {
                return endsWith($f_n, $s);
            }, $supported_extensions);
            if (count(array_intersect($f_extensions, array(True))) === 0) {
                handleError('ERR: file {' . $f_n . '} is has an unsupported extension!');
            }
        }

        # Get user directory.
        $local_dir_tail .= ($usr . '/');
        $local_dir = $local_dir_head . $local_dir_tail;
        if (!is_dir($local_dir)) {
            $oldmask = umask(000);
            if(!mkdir($local_dir)){
                handleError('Failed to create user directory {' . $local_dir_tail . '}!');            
            }
            umask($oldmask);
        }


        # Get Database Connection.
        require_once "../db/db_connection.php";
        $conn = OpenCon();

        # Verify user is real.
        $q = "SELECT id FROM `Users` WHERE username='{$usr}'";
        $q_r = Query($conn, $q);
        if ($q_r->num_rows != 1) {
            handleError('User {' . $usr . '} not found!');
        }
        $usr_id = $q_r->fetch_row()[0];
        $q_r->close();

        # Delete old files.
        $q = "SELECT id FROM `Jobs` WHERE user={$usr_id} AND status in ('Created','Queued','Running','Done')";
        $q_r = Query($conn, $q);
        $jobs_to_keep = array();
        while ($r = $q_r->fetch_row()) {
            $jobs_to_keep[] = $r[0];
        }
        $q_r->close();
        $files = glob($local_dir . '*');
        foreach ($files as $f_n) {
            $should_del = True;
            foreach ($jobs_to_keep as $j) {
                if (strpos($f_n, $j)) {
                    $should_del = False;
                    break;
                }
            }
            if (is_file($f_n) && $should_del) {
                unlink($f_n);
            }
        }

        # Create job name.
        $dt = date('Y-m-d H:i:s', time());
        $job = substr(hash('sha256', $usr . $dt), 0, 16);
        echo 'Job id: ' . $job;
        echo '<br>';
        echo '<br>';
        
        # Create job in mysql.
        $q = "INSERT INTO `Jobs` (`id`, `user`, `created`) VALUES ('{$job}', {$usr_id}, '{$dt}')";
        $q_r = Query($conn, $q);

        # Copy files. 
        for ($i = 0; $i < count($_FILES['file']['name']); $i++) {
            $f_n = $_FILES['file']['name'][$i];
            $f_tmp = $_FILES['file']['tmp_name'][$i];
            $f_n_new = $job . '_' . str_pad(strval($i), 2, '0', STR_PAD_LEFT);

            if (move_uploaded_file($f_tmp, $local_dir . $f_n_new)) {
                echo 'File {' . $f_n . '} has been uploaded as {' . $local_dir_tail . $f_n_new . '}';
                echo '<br>';
            } else {
                handleError('ERR: could not upload file {' . $f_n . '}');
            }
        }


        echo '<br>';
        echo '<p> Input files have been accepted!</p>';
        echo '<br>';
        $job_url = 'https://musicai.app/job/job.html?job=' . $job;
        echo "<a href='{$job_url}'>Launch Training Job</a>";
        ?>
    </body>
</html>