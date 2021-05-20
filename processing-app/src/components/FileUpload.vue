<template>
  <div class="file-upload">
    <h3>Processing tool for ISSUM Campus Simulator Logs</h3>
    <input type="file" @change="onFileChange" />
    <div v-if="progress" class="progess-bar" :style="{ width: progress }">
      {{ progress }}
    </div>
    <button
      @click="onUploadFile"
      class="upload-button"
      :disabled="!this.selectedFile"
    >
      Upload file
    </button>
    <button
      @click="onProcessFile"
      class="upload-button"
      :disabled="!this.uploadedFile"
    >
      Process
    </button>
    <button
      @click="onDownloadFile"
      class="upload-button"
      :disabled="!this.isDownloadReady"
    >
      Download
    </button>
    <button
      @click="onContinue"
      class="upload-button"
      :disabled="!this.isContinueReady"
    >
      Continue Processing
    </button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      selectedFile: "",
      progress: 0,
      uploadedFile: "",
      isDownloadReady: false,
      isContinueReady: false,
    };
  },
  methods: {
    onFileChange(f) {
      const selectedFile = f.target.files[0];
      this.selectedFile = selectedFile;
    },
    onUploadFile() {
      const formData = new FormData();
      formData.append("logs", this.selectedFile);

      axios
        .post("https://issum.sidharth.me/api/upload", formData, {
          onUploadProgress: (ProgressEvent) => {
            let progress =
              Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100) +
              "%";
            this.progress = progress;
          },
        })
        .then((res) => {
          this.uploadedFile = res.data.name;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onProcessFile() {
      this.progress = 0;
      axios
        .post(
          "https://issum.sidharth.me/api/process",
          {
            fileName: this.uploadedFile,
          },
          {
            onUploadProgress: (ProgressEvent) => {
              let progress =
                Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100) +
                "%";
              this.progress = progress;
            },
          }
        )
        .then((res) => {
          this.isDownloadReady = res.data.isDownloadReady;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onDownloadFile() {
      axios({
        method: "GET",
        url: "https://issum.sidharth.me/api/download",
        responseType: "blob",
      })
        .then((res) => {
          var fileURL = window.URL.createObjectURL(new Blob([res.data]));
          var fileLink = document.createElement("a");
          fileLink.href = fileURL;
          fileLink.setAttribute("download", "processed_logs.zip");
          document.body.appendChild(fileLink);
          fileLink.click();
        })
        .catch((err) => {
          console.log(err);
        });
      this.isContinueReady = true;
    },
    onContinue() {
      location.reload();
    },
  },
};
</script>

<style>
.file-upload {
  box-shadow: 2px 2px 9px 2px #ccc;
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 1rem;
  width: 60%;
  margin: 0 auto;
}

input {
  font-size: 0.9rem;
}

input,
div,
button {
  margin-top: 2rem;
}

.upload-button {
  width: 7rem;
  padding: 0.5rem;
  background-color: #2c3e50;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 1rem;
}

.upload-button:disabled {
  background-color: #b3bcc4;
  cursor: no-drop;
}
</style>