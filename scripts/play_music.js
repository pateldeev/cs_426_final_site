function set_player_src() {
    const urlParams = new URLSearchParams(window.location.search);
    var fn = urlParams.getAll('fn');
    if (fn.length !== 1) {
        window.alert('No file to play!');
        window.location.href = '../login/login.php';
    }
    const fn_prefix = 'results/';
    fn = fn_prefix + fn[0];

    $("#audio_player").attr('src', fn);
}

function post_to_twitter(tweet) {

    const urlParams = new URLSearchParams(window.location.search);
    var fn = urlParams.getAll('fn');
    $.get('https://98.182.226.187:3000/twitter_verify_start',
            {fn: fn,
                post_msg: tweet}, function (data) {
        setTimeout(function () {
            window.location.href = ('https://98.182.226.187:3000/twitter_verify_complete');
        }, 1000);

    }, 'text');
}
