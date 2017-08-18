/*
This handles STT for sending data as well as TTS for recieving data
*/

window.recognition = new webkitSpeechRecognition();
window.recognition.continuous = true;
window.recognition.interimResults = false;

// Toggle for speech_rec on or off for data connection
recognizing = false


// Speech Recognition setup
function start_speech_rec_send(conn){

  // If speech_rec has begin, return
  if (recognizing){return}
  recognizing = true

  // Start Speech Rec
  window.recognition.start()

  window.recognition.onresult = function(event) {
    result = event.results[event.results.length - 1][0].transcript

    try {
      conn.send(result)
      window.recognition.stop()
      window.recognition.start()
    }
    catch (err) {
      console.log(err)
    }
    console.log("what you said: " + result)
  }
}

function stop_speech_rec_send() {
  recognizing = false
  window.recognition.stop()
}


// Conneciton Established
function speech_events(conn){
  conn.on('open', function(){
    start_speech_rec_send(conn)

    conn.on('data', function(data){
      console.log("what the other person said: " + data)
      responsiveVoice.speak("" + data)
    });
  });

  conn.on('close', function(){
    stop_speech_rec_send()
  });
}
