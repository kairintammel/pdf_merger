const dropArea = document.getElementById('drop-area');
const inputFile = document.getElementById('input-file');

inputFile.addEventListener('change', showStatus);


function showStatus() {
  let howMany = inputFile.files.length;
  document.getElementById('file-view').innerHTML = `<img src="file.png" alt="File Icon" id="file-icon"><br><p>${howMany} file(s) selected.</p> <br><button onclick="merge()">Merge PDFs</button>`;
}

async function merge(){
  
  const pdfFiles = inputFile.files;

  if(pdfFiles.length < 2){
    alert("Please select at least two PDF files to merge.");
    document.getElementById('file-view').innerHTML = `<img src="upload.png" alt="Upload Icon" id="upload-icon"><br><p id="status-text">Drag & Drop PDF files here<br>or click to select files</p>`;
    return;
  }

  const newPDF = await PDFLib.PDFDocument.create();

  for ( let i = 0; i < pdfFiles.length; i++ ) {
    const inputFile = pdfFiles[i];
    const pdfBytes = await getPDFBytes(inputFile);
    const existingPDF = await PDFLib.PDFDocument.load(pdfBytes);



    const copiedPages = await newPDF.copyPages(existingPDF, existingPDF.getPageIndices());
    copiedPages.forEach((page) => {
      newPDF.addPage(page);
    });

    document.getElementById('file-view').innerHTML = `<img src="upload.png" alt="Upload Icon" id="upload-icon"><br><p id="status-text">Drag & Drop PDF files here<br>or click to select files</p>`;
  }

  const mergedPdfBytes = await newPDF.save();
  downloadPdf(mergedPdfBytes, 'merged.pdf');
}

function downloadPdf(pdfBytes, fileName) {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}

function getPDFBytes(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result));
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
})
}





dropArea.addEventListener('dragover', (event) => {
  event.preventDefault();
});
dropArea.addEventListener('drop', (event) => {
  event.preventDefault();
  inputFile.files = event.dataTransfer.files;
});