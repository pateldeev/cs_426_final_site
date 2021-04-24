function submit_download_request() {

    var link = $("#youtube_link").val();
    const i1 = link.indexOf("&");
    const i2 = link.indexOf("=");
    if (i1 === -1 || i2 === -1 || i2 <= i1) {
        alert('Bad Link!');
        return;
    }
    link = link.substring(i1 + 1, i2);
    
    
$.get('https://98.182.226.187:3000/download_from_youtube')


}

