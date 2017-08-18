// Compatibility shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

window.recognition = new webkitSpeechRecognition();
window.recognition.start();
window.recognition.continuous = true;
window.recognition.interimResults = false;

// PeerJS object
var peer = new Peer({host: 'simulchat.com', port: 9000, path: '/myapp', secure: true, debug: 3, config: {'iceServers': [
  { url: 'stun:stun.l.google.com:19302' },
  {
    url: 'turn:numb.viagenie.ca',
    credential: 'simulchat',
    username: 'simulchat@gmail.com'
  }
]}});

peer.on('open', function(){
  $('#my-id').text(peer.id);
});

// Receiving a call
peer.on('call', function(call){
  // Answer the call automatically (instead of prompting user) for demo purposes
  call.answer(window.localStream);
  step3(call);
});
peer.on('error', function(err){
  alert(err.message);
  // Return to step 2 if error occurs
  step2();
});

// Speech Recognition setup
function start_speech_rec_send(conn){
  window.recognition.onresult = function(event) {
    result = event.results[event.results.length - 1][0].transcript

    try {
      conn.send(result)
    }
    catch (err) {
      console.log(err)
    }
    console.log("what you said: " + result)
  }
  setInterval(function(){
    console.log('refresh')
    try {
      window.recognition.start();
    } catch (err) {
      console.log('recog already started')
    }
  }, 50 * 1000) // reset every 50 seconds
}

function stop_speech_rec_send() {
  window.recognition.stop()
}


// Conneciton Established
function connection_made(conn){
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


peer.on('connection', function(conn) {
  connection_made(conn)
});

// Click handlers setup
$(function(){
  $('#make-call').click(function(){
    // Initiate a call!
    var call = peer.call($('#callto-id').val(), window.localStream);

    step3(call);
  });

  $('#end-call').click(function(){
    window.existingCall.close();
    step2();
  });

  // Retry if getUserMedia fails
  $('#step1-retry').click(function(){
    $('#step1-error').hide();
    step1();
  });

  // Get things started
  step1();
});

function step1 () {
  // Get audio/video stream
  navigator.getUserMedia({audio: false, video: true}, function(stream){
    // Set your video displays
    $('#my-video').prop('src', URL.createObjectURL(stream));

    window.localStream = stream;
    step2();
  }, function(){ $('#step1-error').show(); });
}

function step2 () {
  $('#step1, #step3').hide();
  $('#step2').show();
}

function step3 (call) {
  // Hang up on an existing call if present
  if (window.existingCall) {
    window.existingCall.close();
  }

  // Wait for stream on the call, then set peer video display
  call.on('stream', function(stream){
    $('#their-video').prop('src', URL.createObjectURL(stream));
  });

  window.existingCall = call;

  // Establish connection
  var conn = peer.connect(call.peer)

  connection_made(conn)

  window.existingCall.on('close', function(){
    conn.close()
  });

  // UI stuff
  $('#their-id').text(call.peer);
  call.on('close', step2);
  $('#step1, #step2').hide();
  $('#step3').show();
}
