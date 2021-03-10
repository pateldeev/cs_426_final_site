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
