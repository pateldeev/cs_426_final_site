function populate_job_id() {
    const urlParams = new URLSearchParams(window.location.search);
    var j_id = urlParams.getAll('job');
    if (j_id.length !== 1) {
        window.alert('No job id provided!');
        window.location.href = '../login/login.php';
    }
    j_id = j_id[0];
    for (let e_n of ['page_title']) {
        document.getElementById(e_n).innerHTML += j_id;
    }
    $("#label_job").val(j_id);
}

function validate_job() {
    var status_fn = null;

    $.ajaxSetup({async: false});
    $.get('https://68.227.63.30:3000/job', {job_id: $("#label_job").val()},
            function (data) {
                if (data['err']) {
                    alert('NodeJS error in validating job: ' + data['err_msg']);
                    return;
                }

                j = data['job'];
                $("#label_user").val(j['uname']);
                $("#label_date").val(j['created']);
                $("#label_status").val(j['status']);
                status_fn = j['output_file'];
            }, 'json');
    $.ajaxSetup({async: true});


    return status_fn;
}

function delete_job() {
    if (!confirm("Are you sure you want to kill and/or delete this job?")) {
        return;
    }

    $.get('https://68.227.63.30:3000/delete_job', {job_id: $("#label_job").val()},
            function (data) {
                if (data !== "Success") {
                    alert('Failed to delete: ' + data);
                    return;
                }
                window.location.replace("../login/login.php");
            }, 'text');
}

function link_status_file(status_fn, read_file = true, refill = true) {
    var t = document.getElementById('job_output_table');

    $.get('https://68.227.63.30:3000/model_status',
            {
                job_id: $("#label_job").val(),
                job_out_file: status_fn,
                job_status: $("#label_status").val(),
                read_file: read_file
            },
            function (data) {
                if (data['err']) {
                    alert('Got NodeJS error: ' + data['err_msg']);
                    return;
                }

                if (data['status'] !== $("#label_status").val()) {
                    $("#label_status").val(data['status']);
                    if (data['status'] === 'Done') {
                        setTimeout(function (fn) {
                            alert("Job is Done!");
                            handle_job_done(fn);
                        }, 1000, status_fn);
                    }
                }

                if (refill) {
                    $("#job_output_table:not(:first)").remove();
                }
                data['output_lines'].forEach(function (l) {
                    var r = t.insertRow(-1);
                    var c = r.insertCell();
                    c.innerHTML = l;
                });

                var callback_ts = 200;
                if (data['is_running'] || data['status'] === "Queued") {
                    if (data['status'] === "Queued")
                        callback_ts = 1000;
                    setTimeout(link_status_file, callback_ts, status_fn, false, false);
                } else if ($("#label_status").val() === "Done" && !refill) {
                    setTimeout(link_status_file, callback_ts, status_fn, true, true);
                }
            }, 'json');
}

function start_job() {
    $("#start_button").hide();
    $.get('https://68.227.63.30:3000/start_job', {job_id: $("#label_job").val(), user: $("#label_user").val()},
            function (data) {
                if (data['err']) {
                    alert('Could not start job: ' + data['err_msg']);
                    return;
                }

                $("#label_status").val(data['status']);
                link_status_file(data['output_file'], false, true);
            }, 'json');
}

function is_uploaded(result_fn) {
    var ret;
    $.ajaxSetup({async: false});
    $.get('https://68.227.63.30:3000/is_uploaded', {fn: result_fn},
            function (data) {
                if (data === 'Yes') {
                    ret = true;
                } else {
                    ret = false;
                }
            }, 'text');
    $.ajaxSetup({async: true});
    return ret;
}

function upload_result(result_fn) {
    $.get('https://68.227.63.30:3000/upload_result', {fn: result_fn},
            function (data) {
                if (data['err']) {
                    alert('Could not upload result: ' + data['err_msg']);
                    return;
                }

                setTimeout(() => {
                    if (is_uploaded(result_fn)) {
                        populate_upload_result_link(result_fn);
                    } else {
                        alert('Failed to upload result: TimeOut! Please wait a couple minutes and refresh page.');
                    }
                }, 5000);
            }, 'json');
}

function populate_upload_result_link(result_fn) {
    $("#uploaded_result_success").show();
    const result_link = '../play_music.html?fn=' + result_fn.substring(result_fn.lastIndexOf('/') + 1);
    $("#uploaded_result_success").append(`<a href='${result_link}'>Play Song</a>`);
}

function handle_job_done(status_fn) {
    const result_fn = status_fn.replace('.log', '.mp3');
    $("#upload_result_button").show();

    if (is_uploaded(result_fn)) {
        populate_upload_result_link(result_fn);
    } else {
        $("#upload_result_button").click(function () {
            upload_result(result_fn);
        });
        $("#upload_result_button").prop("disabled", false);
    }
}
