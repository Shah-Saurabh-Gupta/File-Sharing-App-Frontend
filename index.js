const dropZone = document.querySelector(".drop-zone");
const browseBtn = document.querySelector(".browseBtn");
const fileInput = document.querySelector("#fileInput");

const progressContainer = document.querySelector(".progress-container");
const bgProgress = document.querySelector(".bg-progress");
const progressBar = document.querySelector(".progress-bar");
const percentDiv = document.querySelector("#percent");

const sharingContainer = document.querySelector(".sharing-container");
const fileURLinput = document.querySelector("#fileURL");
const copyBtn = document.querySelector("#cpoyBtn");

//only 3000 port allowed
const host = "https://innShare.herokuapp.com/";
const uploadURL = `${host}api/files`;

dropZone.addEventListener("dragover", (e) => {
    //console.log("dragging");
    e.preventDefault();
    if (!dropZone.classList.contains("dragged")) {
        dropZone.classList.add("dragged");
    }
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragged");
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragged");
    const files = e.dataTransfer.files
    //console.table(files);
    if (files.length) {
        fileInput.files = files;
        uploadFile();
    }
});

fileInput.addEventListener("change", () => {
    uploadFile();
})

browseBtn.addEventListener("click", () => {
    fileInput.click();
});

copyBtn.addEventListener("click", () => {
    fileURLinput.select();
    document.execCommand("copy");
});

const uploadFile = () => {
    progressContainer.style.display = "block";
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("myfile", file);

    const xhr = new XMLHttpRequest();
    //
    xhr.onreadystatechange = () => {
        //console.log(xhr.readyState);
        if (xhr.readyState === XMLHttpRequest.DONE) {
            //console.log(xhr.response);
            showLink(JSON.parse(xhr.response));
        }
    };
    xhr.upload.onprogress = updateProgress;

    xhr.open("POST", uploadURL);
    xhr.send(formData);
};

const updateProgress = (e) => {
    //console.log(e);
    const percent = Math.round((e.loaded / e.total) * 100);
    //console.log(percent);
    bgProgress.style.width = `${percent}%`;
    percentDiv.innerText = percent;
    progressBar.style.transform = `scaleX(${percent / 100})`;
};

const showLink = ({ file: url }) => {
    //console.log(url);
    progressContainer.style.display = "none";
    sharingContainer.style.display = "block";
    fileURLinput.value = url;
};