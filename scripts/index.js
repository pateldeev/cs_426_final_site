function init_sound_cloud() {
    console.log('Starting SoundCloud Init');
    SC.initialize({
        // https://stackoverflow.com/a/54762244
        client_id: 'LIf3TVPezlF9x52Tvc4ceSciGuntbBhl',
    });
}

function sound_cloud_embed_html(track_url, ele) {
    SC.oEmbed(track_url, {auto_play: false, show_comments: false}).then(function (oEmbed) {
        // https://github.com/dart-lang/sdk/issues/41659
        console.log('oEmbed response: ', oEmbed);
        ele.innerHTML = oEmbed['html'];
    });
}

function ShowHelpText() {
    var x = document.getElementById("helpText");
    if (x.style.display === "none") {
        x.style.display = "initial";
    } else {
        x.style.display = "none";
    }
}
