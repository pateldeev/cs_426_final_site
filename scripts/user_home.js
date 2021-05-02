// Validate user.
function validate_user() {
    const urlParams = new URLSearchParams(window.location.search);
    var usr = urlParams.getAll('user');
    if (usr.length !== 1) {
        window.alert('Login could not be verified. Redirecting to login page!');
        window.location.href = 'login/login.php';
    }
    usr = usr[0];
    document.getElementById('page_title').innerHTML += usr;
    document.getElementById('welcome_banner').innerHTML += usr;
    document.getElementById('button_generate_music').href += usr;
    document.getElementById('button_exisiting_jobs').href += usr;
}