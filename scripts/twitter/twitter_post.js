function twitter_post() {
    var tweet_msg = document.getElementById("tweet").value;
    tweet_msg += " (" + window.location.href + ")";

    const urlParams = new URLSearchParams(window.location.search);
    const fn = urlParams.getAll('fn');
    $.get('https://98.182.226.187:3000/twitter_verify_start',
            {fn: fn, post_msg: tweet_msg},
            function (data) {
                setTimeout(function () {
                    window.location.href = ('https://98.182.226.187:3000/twitter_verify_complete');
                }, 1000);

            }, 'text');
}
