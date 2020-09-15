import "regenerator-runtime/runtime";
// clang-format off
import {
  drawBoundingBox,
  drawKeypoints,
  drawSkeleton,
  renderImageToCanvas,
} from "./demo_util";

function getQueryStrings() {
  var assoc = {};
  var decode = function (s) {
    return decodeURIComponent(s.replace(/\+/g, " "));
  };
  var queryString = location.search.substring(1);
  var keyValues = queryString.split("&");

  for (var i in keyValues) {
    var key = keyValues[i].split("=");
    if (key.length > 1) {
      assoc[decode(key[0])] = decode(key[1]);
    }
  }
  return assoc;
}

let image = null;
let imageWidth = 513;
let imageHeight = 513;
let predictedPoses = null;

const defaultQuantBytes = 2;

//const defaultMobileNetMultiplier = isMobile() ? 0.5 : 0.75;
const defaultMobileNetMultiplier = 0.75;
const defaultMobileNetStride = 16;
const defaultMobileNetInputResolution = 513;

const defaultResNetMultiplier = 1.0;
const defaultResNetStride = 32;
const defaultResNetInputResolution = 257;

let guiState = {
  net: null,
  model: {
    architecture: "MobileNetV1",
    outputStride: defaultMobileNetStride,
    inputResolution: defaultMobileNetInputResolution,
    multiplier: defaultMobileNetMultiplier,
    quantBytes: defaultQuantBytes,
  },
  image: "tennis_in_crowd.jpg",
  multiPoseDetection: {
    minPartConfidence: 0.1,
    minPoseConfidence: 0.2,
    nmsRadius: 20.0,
    maxDetections: 15,
  },
  showKeypoints: true,
  showSkeleton: true,
  showBoundingBox: true,
};

function multiPersonCanvas() {
  return document.querySelector("#multi canvas");
}
function drawResults(canvas, poses, minPartConfidence, minPoseConfidence) {
  renderImageToCanvas(image, [imageWidth, imageHeight], canvas);

  const ctx = canvas.getContext("2d");

  poses.forEach((pose) => {
    if (pose.score >= minPoseConfidence) {
      if (guiState.showKeypoints) {
        drawKeypoints(pose.keypoints, minPartConfidence, ctx);
      }
      if (guiState.showSkeleton) {
        drawSkeleton(pose.keypoints, minPartConfidence, ctx);
      }
      if (guiState.showBoundingBox) {
        drawBoundingBox(pose.keypoints, ctx);
      }
    }
  });
}

async function loadImage(imagePath) {
  const image = new Image();
  const promise = new Promise((resolve, reject) => {
    image.crossOrigin = "";
    image.onload = () => {
      resolve(image);
      imageWidth = image.width;
      imageHeight = image.height;
      console.log(image.width + " " + image.height);
    };
  });
  image.src = `${imagePath}`;
  return promise;
}

async function fetchPoses(frameMetadataPath) {
  return new Promise((resolve, reject) => {
    fetch(frameMetadataPath)
      .then(function (response) {
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }
        response.json().then(function (data) {
          resolve(data);
        });
      })
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
      });
  });
}

async function fetchPrevNextFrame(manifestPath, frame, videoFolderId) {
  console.log("Frame : " + frame);
  new Promise((resolve, reject) => {
    fetch(manifestPath)
      .then(function (response) {
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }
        response.json().then(function (data) {
          resolve(data);
        });
      })
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
      });
  }).then((data) => {
    let files = data;
    let prevFrame = "";
    let currentIsNext = false;
    for (let i = 0; i < files.length; i++) {
      if (currentIsNext) {
        var aNext = document.getElementById("next");
        aNext.href =
          "view-frame.html?videoFolderId=" +
          videoFolderId +
          "&frame=" +
          files[i];
        aNext.innerHTML = "Next Frame: " + files[i];
        return;
      }
      if (files[i] == frame) {
        //Set Prev
        if (i > 0) {
          var aPrev = document.getElementById("prev");
          aPrev.href =
            "view-frame.html?videoFolderId=" +
            videoFolderId +
            "&frame=" +
            prevFrame;
          aPrev.innerHTML = "Previous Frame: " + prevFrame;
        }
        currentIsNext = true;
      }
      if (i > 0) {
        prevFrame = files[i];
      }
    }
    console.log(data);
  });
  return;
}

/**
 * Draw the results from the multi-pose estimation on to a canvas
 */
function drawMultiplePosesResults() {
  const canvas = multiPersonCanvas();
  drawResults(
    canvas,
    predictedPoses,
    guiState.multiPoseDetection.minPartConfidence,
    guiState.multiPoseDetection.minPoseConfidence
  );
}

//Start Here

export async function bindPage() {
  console.log("starting the page");

  //Query String
  var qs = getQueryStrings();
  console.log(qs);

  var frame = qs["frame"];
  var videoFolderId = qs["videoFolderId"];

  //Get Paths
  var framePath = "./frames/" + videoFolderId + "/" + frame;
  var manifestPath = "./frames/" + videoFolderId + "/manifest.json";
  var frameMetadataPath =
    "./frames_metadata/" + videoFolderId + "/" + frame + ".json";

  //*****************************

  document.getElementById("results").style.display = "none";

  //Purge prevoius variables and free up GPU memory
  //disposePoses();

  // Load image
  image = await loadImage(framePath);

  // Render Prev and Next Buttons
  let x = await fetchPrevNextFrame(manifestPath, frame, videoFolderId);
  // Load pose metadata
  predictedPoses = await fetchPoses(frameMetadataPath);

  console.log("pre");
  console.log(predictedPoses);
  // Draw poses.
  drawMultiplePosesResults();

  document.getElementById("results").style.display = "block";
  //input.dispose();

  //  setupGui(net);
  //  await testImageAndEstimatePoses(net);
}

bindPage();
