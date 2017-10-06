/*
This handles STT for sending data as well as TTS for recieving data
*/

// If you are using VanillaJS
const artyom = new Artyom();

var UserDictation = undefined

// Speech Recognition setup
function start_speech_rec_send(conn) {
    recognizing = true

    let lastLine = ''
    UserDictation = artyom.newDictation({
        continuous: true, // Enable continuous if HTTPS connection
        onResult: function (text) {
        if (text == '') {
            console.log('you said: ' + lastLine);
            con.send(lastLine)
        }
        lastLine = text
        },
        onStart: function () {
            console.log("Dictation started by the user");
        },
        onEnd: function () {
            alert("Dictation stopped by the user");
        }
    });

    UserDictation.start();
}


function stop_speech_rec_send() {
    recognizing = false
    UserDictation.stop()
}


// Conneciton Established
function speech_events(conn) {
    conn.on('open', function () {
        start_speech_rec_send(conn)

        conn.on('data', function (data) {
            console.log("what the other person said: " + data)
            responsiveVoice.speak("" + data)
        });
    });

    conn.on('close', function () {
        stop_speech_rec_send()
    });
}
