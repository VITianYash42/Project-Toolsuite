let peer = null;
let currentCall = null;

// 1. SHARING YOUR SCREEN
async function startSharing() {
    // Generate a simple 4-digit code
    const shortId = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Initialize Peer with that ID
    // Note: PeerJS IDs must be unique, so we prefix it
    peer = new Peer('toolsuite-' + shortId);

    peer.on('open', (id) => {
        document.getElementById('setup-zone').classList.add('hidden');
        document.getElementById('display-zone').classList.remove('hidden');
        document.getElementById('share-id-display').innerHTML = `SHARE THIS CODE: <strong>${shortId}</strong>`;
        document.getElementById('status-text').innerText = "Waiting for receiver to connect...";
    });

    peer.on('call', async (call) => {
        const stream = await navigator.mediaDevices.getDisplayMedia({ 
            video: { cursor: "always" },
            audio: false 
        });
        
        call.answer(stream); // Send the screen stream to the caller
        document.getElementById('status-text').innerText = "Streaming LIVE!";
        
        // Show local preview
        document.getElementById('videoElement').srcObject = stream;
    });

    peer.on('error', (err) => {
        alert("ID taken or connection error. Try again.");
        location.reload();
    });
}

// 2. WATCHING A SCREEN
function joinStream() {
    const code = document.getElementById('joinCode').value.trim();
    if (code.length < 4) return alert("Enter a valid code.");

    peer = new Peer(); // Receiver gets a random ID

    peer.on('open', (id) => {
        document.getElementById('setup-zone').classList.add('hidden');
        document.getElementById('display-zone').classList.remove('hidden');
        document.getElementById('status-text').innerText = "Connecting to " + code + "...";

        // We "call" the host. In our logic, the host answers with their screen.
        const call = peer.call('toolsuite-' + code, null); 
        
        call.on('stream', (remoteStream) => {
            document.getElementById('videoElement').srcObject = remoteStream;
            document.getElementById('status-text').innerText = "Viewing Remote Screen";
        });
    });
}
