function validate_user() {
    const urlParams = new URLSearchParams(window.location.search);
    var usr = urlParams.getAll('user');
    if (usr.length !== 1) {
        window.alert('Login could not be verified. Redirecting to login page!');
        window.location.href = 'login/login.php';
    }
    usr = usr[0];
    for (let e_n of ['page_title', 'existing_header']) {
        document.getElementById(e_n).innerHTML += usr;
    }
    document.getElementById('create_form_user').value = usr;
}

function populate_jobs_table() {
    $.get('https://68.227.63.30:3000/jobs_associated_to_user', {user: document.getElementById('create_form_user').value},
            function (data) {
                if(data['err']){
                    alert('NodeJS error in getting jobs associated with user: ' + data['err_msg']);
                    return;
                }
                
                for (let j of data['jobs']){
                    var r = document.getElementById("existing_jobs_table").insertRow();
                    var c;
                    c = r.insertCell();
                    c.innerHTML = `<a href='job/job_home.html?job=${j['id']}'>${j['id']}</a>`;
                    c = r.insertCell();
                    c.innerHTML = j['created'];
                    c = r.insertCell();
                    c.innerHTML = j['status'];
                }
            }, 'json');
}
