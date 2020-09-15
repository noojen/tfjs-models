//Handler for Manifest
/*
const manifestElement = document.getElementById("manifest");
manifestElement.addEventListener("change", handleManifest, false);
function handleManifest() {
  //const fileList = this.files;
  //now you can work with the file list
  let file = this.files[0];
  var reader = new FileReader();
  reader.onload = function (evt) {
    console.log(evt.target.result);
  };
  reader.readAsText(file);
}
*/

window.onload = () => {
  fetch("./videos/manifest.json")
    .then(function (response) {
      if (response.status !== 200) {
        console.log(
          "Looks like there was a problem. Status Code: " + response.status
        );
        return;
      }

      // Examine the text in the response
      response.json().then(function (data) {
        console.log("321");

        let files = data["files"];
        console.log(files);

        var domV = document.getElementById("videos");

        for (let i = 0; i < files.length; i++) {
          var buttonX = document.createElement("button");
          buttonX.innerHTML = files[i].filename;
          buttonX.addEventListener("click", function () {
            fetchFrames(files[i].folderId);
          });
          domV.append(buttonX);
        }
      });
    })
    .catch(function (err) {
      console.log("Fetch Error :-S", err);
    });
};

function fetchFrames(folderId) {
  let framesPath = "./frames/" + folderId + "/manifest.json";
  fetch(framesPath)
    .then(function (response) {
      if (response.status !== 200) {
        console.log(
          "Looks like there was a problem. Status Code: " + response.status
        );
        return;
      }
      response.json().then(function (data) {
        console.log(data);
        let files = data;
        var frameV = document.getElementById("frames-list");

        for (let i = 0; i < files.length; i++) {
          var frameX = document.createElement("a");
          frameX.innerHTML = files[i];
          frameX.href =
            "view-frame.html?videoFolderId=" + folderId + "&frame=" + files[i];
          frameX.target = "_blank";
          frameV.append(frameX);
        }
      });
    })
    .catch(function (err) {
      console.log("Fetch Error :-S", err);
    });
}
