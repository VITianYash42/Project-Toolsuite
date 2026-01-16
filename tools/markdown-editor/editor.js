'use strict';

const input = document.getElementById('markdownInput');
const preview = document.getElementById('preview');
const clearBtn = document.getElementById('clearBtn');
const copyHtmlBtn = document.getElementById('copyHtmlBtn');
const downloadBtn = document.getElementById('downloadBtn');

const defaultText = `# Welcome to Toolsuite Editor

Type on the **left**, see the result on the **right**.

- [x] Fast
- [x] Private
- [x] Minimalist

> "Simplicity is the ultimate sophistication."
`

function init(){
  input.value = localStorage.getItem('toolsuite-md-draft') || defaultText;
  updatePreview();
}

function updatePreview(){
  const raw = input.value;

  preview.innerHTML = marked.parse(raw);

  localStorage.setItem('toolsuite-md-draft', raw);
}

input.addEventListener('input', updatePreview);

clearBtn.addEventListener('click', () => {
  if(confirm("Clear all text?")){
    input.value = '';
    updatePreview();
  }
});

copyHtmlBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(preview.innerHTML);
  const originalText = copyHtmlBtn.innerText;
  copyHtmlBtn.innerText = "COPIED!";
  setTimeout(() => copyHtmlBtn.innerText = originalText, 2000);
})

downloadBtn.addEventListener('click', () => {
  const blob = new Blob([input.value], {type: 'text/markdown'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'document.md';
  a.click();
  URL.revokeObjectURL(url);
})

init();

