function validate_user() {
    const urlParams = new URLSearchParams(window.location.search);
    var usr = urlParams.getAll('user');
    if (usr.length !== 1) {
        window.alert('Login could not be verified. Redirecting to login page!');
        window.location.href = 'login/login.php';
    }
    usr = usr[0];
    document.getElementById('page_title').innerHTML += usr;
    document.getElementById('existing_header').innerHTML += usr;
    document.getElementById('create_link').href += usr;
    return usr;
}

function populate_jobs_table(usr_name) {
    $.get('https://98.182.226.187:3000/jobs_associated_to_user', {user: usr_name},
            function (data) {
                if(data['err']){
                    alert('NodeJS error in getting jobs associated with user: ' + data['err_msg']);
                    return;
                }
                
                for (let j of data['jobs']){
                    var r = document.getElementById("existing_jobs_table").insertRow();
                    var c;
                    c = r.insertCell();
                    c.innerHTML = `<a href='job.html?job=${j['id']}'>${j['id']}</a>`;
                    c = r.insertCell();
                    c.innerHTML = j['created'];
                    c = r.insertCell();
                    c.innerHTML = j['status'];
                }
            }, 'json');
}
