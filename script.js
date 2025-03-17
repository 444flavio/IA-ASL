let modelURL = "https://teachablemachine.withgoogle.com/models/0-P71lGnO/";
console.log("Teachable Machine URL:", modelURL);
let video=  document.getElementById("video");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Imposta dimensioni del canvas come quelle del video
canvas.width = 640;
canvas.height = 480;

// Carica il modello HandPose
async function loadModel() {
    model = await handpose.load();
    console.log("✅ Modello HandPose caricato!");
}

// Avvia la webcam
async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    
    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

// Disegna punti sulle mani rilevate
function drawKeypoints(predictions) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    predictions.forEach(prediction => {
        const keypoints = prediction.landmarks;
        
        keypoints.forEach(point => {
            const [x, y] = point;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI); // Disegna un cerchio su ogni punto della mano
            ctx.fillStyle = "red";
            ctx.fill();
        });
    });
}

// Analizza il video e rileva le mani
async function detectHands() {
    if (!model) return;
    
    const predictions = await model.estimateHands(video);
    drawKeypoints(predictions); // Aggiunge i punti sulla mano

    if (predictions.length > 0) {
        let recognizedText = "Segno rilevato!";  // Puoi collegarlo al modello ASL
        document.getElementById("result").innerText = recognizedText;
        speakText(recognizedText);
    } else {
        document.getElementById("result").innerText = "Nessuna mano rilevata";
    }

    requestAnimationFrame(detectHands);
}

// Sintesi vocale
function speakText(text) {
    let speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.lang = "it-IT";
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
}

// Avvia tutto
async function main() {
    await loadModel();
    await setupCamera();
    video.play();
    detectHands();
}

main();