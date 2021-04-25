function validate_user() {
    const urlParams = new URLSearchParams(window.location.search);
    var usr = urlParams.getAll('user');
    if (usr.length !== 1) {
        window.alert('Login could not be verified. Redirecting to login page!');
        window.location.href = 'login/login.php';
    }
    usr = usr[0];
    document.getElementById('page_title').innerHTML += usr;
    document.getElementById('create_form_user').value = usr;
    document.getElementById('existing_jobs_link').href += usr;
}

function ShowHelpText() {
    var x = document.getElementById("helpText");
    if (x.style.display === "none") {
        x.style.display = "initial";
    } else {
        x.style.display = "none";
    }
}
