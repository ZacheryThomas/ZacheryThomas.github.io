/*
This handles STT for sending data as well as TTS for recieving data
*/

// If you are using VanillaJS
const artyom = new Artyom();


// Conneciton Established
function speech_events(conn) {
    let lastLine = ''
    let UserDictation = artyom.newDictation({
        continuous: true, // Enable continuous if HTTPS connection
        onResult: function (text) {
            if (text == '') {
                console.log('you said: ' + lastLine);
                conn.send(lastLine)
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

    conn.on('open', function () {
        UserDictation.start()

        conn.on('data', function (data) {
            console.log("what the other person said: " + data)
            responsiveVoice.speak("" + data)
        });
    });

    conn.on('close', function () {
        UserDictation.end()
    });
}
