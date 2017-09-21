/*
This handles STT for sending data as well as TTS for recieving data
*/

//window.recognition = new webkitSpeechRecognition();
//window.recognition.continuous = true;
//window.recognition.interimResults = false;

// Toggle for speech_rec on or off for data connection
recognizing = false

// If you are using VanillaJS
const artyom = new Artyom();

function startContinuousArtyom(){
  artyom.fatality();// use this to stop any of

  setTimeout(function(){// if you use artyom.fatality , wait 250 ms to initialize again.
       artyom.initialize({
          lang:"en-GB",// A lot of languages are supported. Read the docs !
          continuous:true,// Artyom will listen forever
          listen:true, // Start recognizing
          debug:true, // Show everything in the console
          speed:1 // talk normally
      }).then(function(){
          console.log("Ready to work !");
      });
  },250);
}

recognizing = false
var UserDictation = undefined

// Speech Recognition setup
function start_speech_rec_send(conn){
  recognizing = true
  UserDictation.start();

  UserDictation = artyom.newDictation({
    continuous:true, // Enable continuous if HTTPS connection
    onResult:function(text){
        // Do something with the text
        conn.send(text)
        console.log(text);    
    },
    onStart:function(){
        console.log("Dictation started by the user");
    },
    onEnd:function(){
        alert("Dictation stopped by the user");
    }
  });

  /*
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
  }*/
}

function stop_speech_rec_send() {
  recognizing = false
  UserDictation.stop()
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
