'use strict';

const input = document.getElementById('input');
const output = document.getElementById('output');
const encodeBtn = document.getElementById('encodeBtn');
const decodeBtn = document.getElementById('decodeBtn');

encodeBtn.onclick = () => {
    try {
        output.value = btoa(input.value);
    } catch (e) {
        alert("Unable to encode this text. Ensure it contains valid characters.");
    }
};

decodeBtn.onclick = () => {
    try {
        output.value = atob(input.value);
    } catch (e) {
        alert("Invalid Base64 string. Please check your input.");
    }
};