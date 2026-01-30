'use strict';

const jsonInput = document.getElementById('jsonInput');
const jsonOutput = document.getElementById('jsonOutput');
const statusDiv = document.getElementById('status');
const formatBtn = document.getElementById('formatBtn');
const minifyBtn = document.getElementById('minifyBtn');
const validateBtn = document.getElementById('validateBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');


function showStatus(message, isError = false) {
    statusDiv.textContent = message;
    statusDiv.className = isError ? 'status-error' : 'status-success';
}

function clearStatus() {
    statusDiv.style.display = 'none';
    statusDiv.className = '';
}

function processJSON(mode) {
    const raw = jsonInput.value.trim();
    
    if (!raw) {
        showStatus("Please enter some JSON first.", true);
        return;
    }

    try {
        const obj = JSON.parse(raw);
        
        if (mode === 'format') {
            jsonOutput.value = JSON.stringify(obj, null, 4);
            showStatus("Success: JSON Formatted.");
        } else if (mode === 'minify') {
            jsonOutput.value = JSON.stringify(obj);
            showStatus("Success: JSON Minified.");
        } else if (mode === 'validate') {
            showStatus("Valid JSON: No errors found.");
            if (!jsonOutput.value) jsonOutput.value = JSON.stringify(obj, null, 4);
        }

    } catch (err) {
        showStatus(`Invalid JSON: ${err.message}`, true);
    }
}

formatBtn.onclick = () => processJSON('format');
minifyBtn.onclick = () => processJSON('minify');
validateBtn.onclick = () => processJSON('validate');

clearBtn.onclick = () => {
    jsonInput.value = '';
    jsonOutput.value = '';
    clearStatus();
    jsonInput.focus();
};

copyBtn.onclick = () => {
    if (!jsonOutput.value) return;
    navigator.clipboard.writeText(jsonOutput.value);
    const originalText = copyBtn.textContent;
    copyBtn.textContent = "COPIED!";
    setTimeout(() => copyBtn.textContent = originalText, 2000);
};

downloadBtn.onclick = () => {
    if (!jsonOutput.value) {
        showStatus("Nothing to download.", true);
        return;
    }

    const blob = new Blob([jsonOutput.value], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = "data.json";
    a.click();

    URL.revokeObjectURL(url);
    showStatus("JSON file downloaded.");
};


jsonInput.addEventListener('input', clearStatus);
jsonInput.addEventListener('paste', () => {
    setTimeout(() => {
        processJSON('format');
    }, 50);
});
