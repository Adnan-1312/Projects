let audioContext;
let mediaStreamSource;
let bluetoothDevice;
let bassFilter, trebleFilter, echoDelay, echoFeedback, delay;

document.getElementById('start').addEventListener('click', async () => {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create filters
    bassFilter = audioContext.createBiquadFilter();
    bassFilter.type = 'lowshelf';
    trebleFilter = audioContext.createBiquadFilter();
    trebleFilter.type = 'highshelf';
    echoDelay = audioContext.createDelay();
    echoFeedback = audioContext.createGain();
    delay = audioContext.createDelay();

    // Connect filters
    mediaStreamSource.connect(bassFilter);
    bassFilter.connect(trebleFilter);
    trebleFilter.connect(echoDelay);
    echoDelay.connect(echoFeedback);
    echoFeedback.connect(echoDelay);
    echoDelay.connect(delay);
    delay.connect(audioContext.destination);

    console.log('Microphone access granted');
});

document.getElementById('connect').addEventListener('click', async () => {
    try {
        console.log('Requesting Bluetooth Device...');
        bluetoothDevice = await navigator.bluetooth.requestDevice({
            filters: [{ services: ['battery_service'] }]
        });
        console.log('Connecting to GATT Server...');
        const server = await bluetoothDevice.gatt.connect();
        console.log('Connected to Bluetooth Device');
        
        const output = audioContext.createMediaStreamDestination();
        mediaStreamSource.connect(output);

        const audioElement = new Audio();
        audioElement.srcObject = output.stream;
        audioElement.play();
    } catch (error) {
        console.log('Error: ' + error);
    }
});

document.getElementById('bass').addEventListener('input', function() {
    bassFilter.gain.value = this.value;
});

document.getElementById('treble').addEventListener('input', function() {
    trebleFilter.gain.value = this.value;
});

document.getElementById('echo').addEventListener('input', function() {
    echoFeedback.gain.value = this.value;
});

document.getElementById('delay').addEventListener('input', function() {
    delay.delayTime.value = this.value;
});
