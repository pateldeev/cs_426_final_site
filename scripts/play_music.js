function init_page() {
    // Internal Javascript Code

    // Creating variables for the wave surfer plugins
    var RegionsPlugin = window.WaveSurfer.regions;
    var CursorPlugin = window.WaveSurfer.cursor;
    var TimelinePlugin = window.WaveSurfer.timeline;
    var MicrophonePlugin = window.WaveSurfer.microphone;

    // Naming the buttons used in the program so that I don't need to use getElement everytime
    var buttons = {
        play: document.getElementById("btn-play"),
        pause: document.getElementById("btn-pause"),
        stop: document.getElementById("btn-stop"),
        addregions: document.getElementById("btn-addregions"),
        clearregions: document.getElementById("btn-clearregions"),
        mute: document.getElementById("btn-mute"),
        unmute: document.getElementById("btn-unmute"),
        micon: document.getElementById("btn-micon"),
        micoff: document.getElementById("btn-micoff"),
    };

    // Naming the sliders for the equalizer so that I don't need to use getElement everytime
    var sliders = {
        slider1: document.getElementById("range1"),
        slider2: document.getElementById("range2"),
        slider3: document.getElementById("range3"),
        slider4: document.getElementById("range4"),
        slider5: document.getElementById("range5"),
        slider6: document.getElementById("range6"),
        slider7: document.getElementById("range7"),
        slider8: document.getElementById("range8"),
        slider9: document.getElementById("range9"),
        slider10: document.getElementById("range10")
    };

    // Creates the wave surfer visualizer object
    var Spectrum = WaveSurfer.create({
        container: '#audio-spectrum',
        splitChannels: true, // Allows a cool overlay effect and if I want multiple channels in the future it is there
        splitChannelsOptions: {
            overlay: true,
            channelColors: {
                0: {
                    progressColor: 'blue',
                    waveColor: 'gray'
                },
                1: {
                    progressColor: 'gray',
                    waveColor: 'black'
                }
            }
        },

        plugins: [// Regions, Cursor, and Timeline
            new WaveSurfer.regions.create({}),

            new WaveSurfer.cursor.create({
                showTime: true,
                position: 'relative',
                opacity: 1,
                customShowTimeStyle: {
                    'background-color': '#000',
                    color: '#fff',
                    padding: '2px',
                    'font-size': '10px'
                }
            }),

            new TimelinePlugin.create({
                container: "#wave-timeline"
            }),
        ]
    });

    // Creates Microphone object in Wavesurfer, Primarily used to show user when mic is on and allow them to toggle it
    var wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'black',
        interact: false,
        cursorWidth: 1,
        bufferSize: 16384,

        fillParent: true,
        minPxPerSec: 1000,
        plugins: [
            WaveSurfer.microphone.create()
        ]
    });

    // Plays the music
    buttons.play.addEventListener("click", function () {
        Spectrum.play();
    }, false);

    //Pauses the music
    buttons.pause.addEventListener("click", function () {
        Spectrum.pause();
    }, false);

    // Stops and brings music back to beginning
    buttons.stop.addEventListener("click", function () {
        Spectrum.stop();
    }, false);

    // Adjusts the wavesurfer object if the window is resized
    window.addEventListener("resize", function () {
        var currentProgress = Spectrum.getCurrentTime() / Spectrum.getDuration();

        Spectrum.empty();
        Spectrum.drawBuffer();
        Spectrum.seekTo(currentProgress);

    }, false);

    // Dropdown Controls
    $(document).ready(function () {
        $("#regioncontrols").hide();
        $("#miccontrols").hide();
        $("#equalizercontrols").hide();
        $("#downloadfile").hide();
        $('#dropdown').on('change', function () {
            if (this.value == '0')
            {
                $("#regioncontrols").hide();
                $("#miccontrols").hide();
                $("#equalizercontrols").hide();
                $("#downloadfile").hide();
            }

            if (this.value == '1')
            {
                $("#regioncontrols").show();
                $("#miccontrols").hide();
                $("#equalizercontrols").hide();
                $("#downloadfile").hide();
            }

            if (this.value == '2')
            {
                $("#regioncontrols").hide();
                $("#miccontrols").show();
                $("#equalizercontrols").hide();
                $("#downloadfile").hide();
            }

            if (this.value == '3')
            {
                $("#regioncontrols").hide();
                $("#miccontrols").hide();
                $("#equalizercontrols").show();
                $("#downloadfile").hide();
            }

            if (this.value == '4')
            {
                $("#regioncontrols").hide();
                $("#miccontrols").hide();
                $("#equalizercontrols").hide();
                $("#downloadfile").show();

            }

        });
    });
    buttons.micon.disabled = false;
    // When the mp3 file is loaded
    Spectrum.on('ready', function () {
        buttons.mute.disabled = false;


        // EQUALIZER:

        //Establish Frequencies, types, and id to attach to equalizer
        var EQ = [
            {
                f: 32,
                type: 'lowshelf',
                id: 1
            },
            {
                f: 64,
                type: 'peaking',
                id: 2
            },
            {
                f: 125,
                type: 'peaking',
                id: 3
            },
            {
                f: 250,
                type: 'peaking',
                id: 4
            },
            {
                f: 500,
                type: 'peaking',
                id: 5
            },
            {
                f: 1000,
                type: 'peaking',
                id: 6
            },
            {
                f: 2000,
                type: 'peaking',
                id: 7
            },
            {
                f: 4000,
                type: 'peaking',
                id: 8
            },
            {
                f: 8000,
                type: 'peaking',
                id: 9
            },
            {
                f: 16000,
                type: 'highshelf',
                id: 10
            }
        ];

        // Create the filters with the above specifications
        var filters = EQ.map(function (band) {
            var filter = Spectrum.backend.ac.createBiquadFilter();
            filter.type = band.type;
            filter.gain.value = 0;
            filter.Q.value = 1;
            filter.frequency.value = band.f;
            filter.id = band.id
            return filter;
        });

        // Connect filters to wavesurfer
        Spectrum.backend.setFilters(filters);

        Spectrum.setVolume(0.7);
        document.querySelector('#volume').value = Spectrum.backend.getVolume();

        // Attaches the filters to the range sliders for each one
        filters.forEach(function (filter) {
            if (filter.id = '1')
            {
                var onChange = function (a) {
                    filter.gain.value = ~~a.target.value;
                };
                sliders.slider1.addEventListener('input', onChange);
                sliders.slider1.addEventListener('change', onChange);
            }

            if (filter.id = '2')
            {
                var onChange = function (a) {
                    filter.gain.value = ~~a.target.value;
                };

                sliders.slider2.addEventListener('input', onChange);
                sliders.slider2.addEventListener('change', onChange);
            }

            if (filter.id = '3')
            {
                var onChange = function (a) {
                    filter.gain.value = ~~a.target.value;
                };

                sliders.slider3.addEventListener('input', onChange);
                sliders.slider3.addEventListener('change', onChange);
            }

            if (filter.id = '4')
            {
                var onChange = function (a) {
                    filter.gain.value = ~~a.target.value;
                };

                sliders.slider4.addEventListener('input', onChange);
                sliders.slider4.addEventListener('change', onChange);
            }

            if (filter.id = '5')
            {
                var onChange = function (a) {
                    filter.gain.value = ~~a.target.value;
                };

                sliders.slider5.addEventListener('input', onChange);
                sliders.slider5.addEventListener('change', onChange);
            }

            if (filter.id = '6')
            {
                var onChange = function (a) {
                    filter.gain.value = ~~a.target.value;
                };

                sliders.slider6.addEventListener('input', onChange);
                sliders.slider6.addEventListener('change', onChange);
            }

            if (filter.id = '7')
            {
                var onChange = function (a) {
                    filter.gain.value = ~~a.target.value;
                };

                sliders.slider7.addEventListener('input', onChange);
                sliders.slider7.addEventListener('change', onChange);
            }

            if (filter.id = '8')
            {
                var onChange = function (a) {
                    filter.gain.value = ~~a.target.value;
                };

                sliders.slider8.addEventListener('input', onChange);
                sliders.slider8.addEventListener('change', onChange);
            }

            if (filter.id = '9')
            {
                var onChange = function (a) {
                    filter.gain.value = ~~a.target.value;
                };

                sliders.slider9.addEventListener('input', onChange);
                sliders.slider9.addEventListener('change', onChange);
            }

            if (filter.id = '10')
            {
                var onChange = function (a) {
                    filter.gain.value = ~~a.target.value;
                };

                sliders.slider10.addEventListener('input', onChange);
                sliders.slider10.addEventListener('change', onChange);
            }
        });

        Spectrum.filters = filters;

    });

    //REGION CODE
    Spectrum.on('ready', function () {
        Spectrum.enableDragSelection({});
    });

    Spectrum.on('region-click', function (region, e) {
        console.log(region.start);
        console.log(region.end);
        e.stopPropagation();
        Spectrum.play(region.start, region.end);

    });
    // Gives the user a region on program launch
    Spectrum.addRegion({
        start: 0, // time in seconds
        end: 3, // time in seconds
        color: 'hsla(200, 100%, 30%, 0.1)'
    });

    // Button to add more regions if user doesn't want to do the drag regions
    buttons.addregions.addEventListener("click", function () {
        Spectrum.addRegion({
            start: 4, // time in seconds
            end: 7, // time in seconds
            color: 'hsla(200, 100%, 30%, 0.1)'
        });
    });

    // Clear Regions
    buttons.clearregions.addEventListener("click", function () {
        Spectrum.clearRegions();
    });

    Spectrum.on('region-dblclick', function (region, e) {
        region.remove();
    });

    // mute and unmute
    buttons.mute.addEventListener("click", function () {
        Spectrum.toggleMute();
        buttons.mute.disabled = true;
        buttons.unmute.disabled = false;
    });

    buttons.unmute.addEventListener("click", function () {
        Spectrum.toggleMute();
        buttons.unmute.disabled = true;
        buttons.mute.disabled = false;
    });

    //Volume Controls
    var volumeInput = document.querySelector('#volume');

    var onChangeVolume = function (e) {
        Spectrum.setVolume(e.target.value);
        console.log(e.target.value);
    };

    volumeInput.addEventListener('input', onChangeVolume);
    volumeInput.addEventListener('change', onChangeVolume);

    //Mic Controls
    wavesurfer.microphone.on('deviceReady', function (stream) {
        console.log('Device ready!', stream);
    });

    wavesurfer.microphone.on('deviceError', function (code) {
        console.warn('Device error: ' + code);
    });

    // start the microphone
    buttons.micon.addEventListener("click", function () {
        wavesurfer.microphone.start();
        wavesurfer.microphone.play();
        buttons.micon.disabled = true;
        buttons.micoff.disabled = false;

        // Sets the stream element to a recording variable
        navigator.mediaDevices.getUserMedia({
            audio: true
        })
                .then(stream => {
                    recorder = new MediaRecorder(stream);

                    // If user wants to add more to recording they can press record again
                    recorder.ondataavailable = saveChunkToRecording;
                    recorder.onstop = saveRecording;
                });
    });

    // stop the microphone
    buttons.micoff.addEventListener("click", function () {

        wavesurfer.microphone.stopDevice();

        buttons.micon.disabled = false;
        buttons.micoff.disabled = true;
    });

    // RECORDING
    const chunks = [];

    let recorder = null;
    let audioElement = null;
    let startButton = null;
    let stopButton = null;

    const saveChunkToRecording = (event) => {
        chunks.push(event.data);
    };

    // Saves the recoding to an mp3 
    const saveRecording = () => {
        const blob = new Blob(chunks, {
            type: 'audio/mp3; codecs=opus'
        });

        const url = URL.createObjectURL(blob);

        audioElement.setAttribute('src', url);
    };

    // Record Start Function
    const startRecording = () => {
        recorder.start();
    };

    // Record Stop Function
    const stopRecording = () => {
        recorder.stop();
    };

    // Wait until everything has loaded
    (function () {
        audioElement = document.querySelector('.js-audio');
        startButton = document.querySelector('.js-start');
        stopButton = document.querySelector('.js-stop');

        // Button controls
        startButton.addEventListener('mouseup', startRecording);
        stopButton.addEventListener('mouseup', stopRecording);
    })();

    // Get File Name
    const urlParams = new URLSearchParams(window.location.search);
    var fn = urlParams.getAll('fn');
    const fn_prefix = 'results/';
    fn = fn_prefix + fn[0];

    //loads the song from musicai into the musicplayer
    Spectrum.load(fn);


    // End of JS Portion
}

function init_twitter_link() {
    const urlParams = new URLSearchParams(window.location.search);
    const fn = urlParams.getAll('fn');
    document.getElementById("twitter_post_link").href += ("?fn=" + fn);
}

// Get Download name
function othername() {
    var input = document.getElementById("userInput").value;
    document.getElementById("filename").innerHTML =
            "Current File Name: " + input;
    document.getElementById("btn-download").disabled = false;
    const urlParams = new URLSearchParams(window.location.search);
    var fn = urlParams.getAll('fn');
    const fn_prefix = 'results/';
    fn = fn_prefix + fn[0];
    console.log(fn);
    var ds = document.getElementById("download_song");
    ds.setAttribute('download', input + ".mp3");
    ds.href = fn;

}
