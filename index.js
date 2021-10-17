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

const emailForm = document.querySelector("#emailForm");

const toast = document.querySelector(".toast");


//only 3000 port allowed
//const host = "https://innShare.herokuapp.com/";
const host = "http://localhost:3000/";

const uploadURL = `${host}api/files`;
const emailURL = `${host}api/files/send`;

const maxAllowedFileSize = 100 * 1024 * 1024; //100mb

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
    showToast("Link copied");
});

const uploadFile = () => {

    if (fileInput.files.length > 1) {
        resetFileInput();
        showToast("Only upload 1 files at a time");
        return;
    }
    const file = fileInput.files[0];
    if (file.size > maxAllowedFileSize) {
        resetFileInput();
        showToast("File size greater than 100mb");
        return;
    }

    progressContainer.style.display = "block";
    const formData = new FormData();
    formData.append("myfile", file);

    const xhr = new XMLHttpRequest();
    //
    xhr.onreadystatechange = () => {
        //console.log(xhr.readyState);
        if (xhr.readyState === XMLHttpRequest.DONE) {
            //console.log(xhr.response);
            onUploadSuccess(JSON.parse(xhr.response));
        }
    };
    xhr.upload.onprogress = updateProgress;

    xhr.upload.onerror = () => {
        resetFileInput();
        showToast(`Error in upload: ${xhr.statusTest}`);
    }

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

const onUploadSuccess = ({ file: url }) => {
    //console.log(url);
    resetFileInput();
    emailForm[2].removeAttribute("disabled", "true");
    progressContainer.style.display = "none";
    sharingContainer.style.display = "block";
    fileURLinput.value = url;
};

const resetFIleInput = () => {
    fileInput.value = "";
}

emailForm.addEventListener("submit", (e) => {
    e.preventDefault(); // stop submission

    // disable the button
    emailForm[2].setAttribute("disabled", "true");
    emailForm[2].innerText = "Sending";

    const url = fileURL.value;

    const formData = {
        uuid: url.split("/").splice(-1, 1)[0],
        emailTo: emailForm.elements["to-email"].value,
        emailFrom: emailForm.elements["from-email"].value,
    };
    //console.log(formData);
    fetch(emailURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                showToast("Email Sent");
                sharingContainer.style.display = "none"; // hide the box
                showToast("Email Sent");
            }
        });
});

let toastTimer;
const showToast = (msg) => {
    toast.innerText = msg;
    toast.style.transform = "translate(-50%, 0)";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.style.transform = "translate(-50%, 60px)";
    }, 2000);
}