'use strict';

let pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
});
let isSender = false;

async function init(sender) {
    isSender = sender;
    document.getElementById('step0').classList.add('hidden');
    document.getElementById('step1').classList.remove('hidden');

    if (isSender) {
        document.getElementById('sender-ui').classList.remove('hidden');
        try {
            // Capture the screen
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            stream.getTracks().forEach(track => pc.addTrack(track, stream));
            
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            // CRITICAL: Wait for ICE gathering to complete before showing QR
            pc.onicecandidate = (event) => {
                if (!event.candidate) {
                    // Gathering finished! Now the LocalDescription is complete.
                    console.log("ICE Gathering Complete. Generating QR...");
                    generateQR(JSON.stringify(pc.localDescription), 'qr-canvas');
                    startScanner('scanner-preview-alt');
                    document.getElementById('sender-scan-ui').classList.remove('hidden');
                }
            };
        } catch (err) {
            alert("Error accessing screen: " + err.message);
        }

    } else {
        document.getElementById('receiver-ui').classList.remove('hidden');
        startScanner('scanner-preview');
    }
}

function generateQR(data, canvasId) {
    const canvas = document.getElementById(canvasId);
    // Use Base64 to shrink the string slightly and make it QR-friendly
    const encodedData = btoa(data);
    
    new QRious({
        element: canvas,
        value: encodedData,
        size: 300,
        level: 'L' // Low error correction = less dense QR (easier to scan)
    });
}

// ... (keep the startScanner and tick functions from the previous version)
