function poll_download_status() {
    $.get('https://98.182.226.187:3000/get_youtube_download_status',
            {}, function (data) {
        if (data['running']) {
            setTimeout(poll_download_status(), 1500);
        } else if (data['err']) {
            alert("Node server error: " + data['err_msg']);
            $("#download_status").html("Failed to download! Refresh page");
        } else {
            $("#download_status").html("Got video! Now uploading to frontend server.");
            setTimeout(function (link) {
                $("#download_status").html("Done! <a href=" + link + ">Get song</a>");
            }, 5000, data['result_link']);
        }
    }, 'json');

}

function submit_download_request() {
    // Parse link.
    var link = $("#youtube_link").val();
    const i1 = link.indexOf("=");
    const i2 = link.indexOf("&");
    if (i1 === -1 || (i2 >= 0 && i2 <= i1)) {
        alert('Bad Link!');
        return;
    }
    if (i2 === -1) {
        link = link.substring(i1 + 1);
    } else {
        link = link.substring(i1 + 1, i2);
    }

    $("#submit_download_request").attr('disabled', 'disabled');
    $("#download_status").show();

    $.get('https://98.182.226.187:3000/start_youtube_download',
            {link_url: link}, function (data) {
        if (data.includes("Failure")) {
            $("#download_status").html("Failed to download! Refresh page");
            alert('Failed to download: ' + data);
        } else {
            poll_download_status();
        }
    }, 'text');
}

