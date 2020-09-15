const tfnode = require("@tensorflow/tfjs-node");
const mobilenet = require("@tensorflow-models/mobilenet");

import * as posenet from "@tensorflow-models/posenet";
import { exit } from "shelljs";
import { frame } from "@tensorflow/tfjs-core";

const fs = require("fs");

const classify = async (imagePath) => {
  const image = fs.readFileSync(imagePath);
  const decodedImage = tfnode.node.decodeImage(image, 3);

  //const model = await mobilenet.load();
  //const predictions = await model.classify(decodedImage);

  const defaultQuantBytes = 2;
  const isMobile = false;
  const defaultMobileNetMultiplier = isMobile ? 0.5 : 0.75;
  const defaultMobileNetStride = 16;
  const defaultMobileNetInputResolution = 513;

  const defaultMinPartConfidence = 0.1;
  const minPoseConfidence = 0.2;
  const defaultnmsRadius = 20.0;
  const defaultMaxDetections = 15;

  const defaultResNetMultiplier = 1.0;
  const defaultResNetStride = 32;
  const defaultResNetInputResolution = 257;

  const poseNet = await posenet.load({
    architecture: "MobileNetV1",
    outputStride: defaultMobileNetStride,
    inputResolution: defaultMobileNetInputResolution,
    multiplier: defaultMobileNetMultiplier,
    quantBytes: defaultQuantBytes,
  });

  const poses = await poseNet.estimatePoses(decodedImage, {
    flipHorizontal: false,
    decodingMethod: "multi-person",
    maxDetections: defaultMaxDetections,
    scoreThreshold: defaultMinPartConfidence,
    nmsRadius: defaultnmsRadius,
  });
  return poses;
};

function fetchFrames(framesPath) {
  let manifestPath = framesPath + "/manifest.json";

  let rawdata = fs.readFileSync(manifestPath);
  let frames = JSON.parse(rawdata);
  let fileList = frames;

  for (let i = 0; i < fileList.length; i++) {
    let imagePath = framesPath + fileList[i];
    console.log(imagePath);
    let frameMetadataPath =
      imagePath.replace("/frames/", "/frames_metadata/") + ".json";
    let poses = classify(imagePath);
    poses.then((val) => {
      let data = JSON.stringify(val);
      fs.writeFileSync(frameMetadataPath, data);
      console.log("wrote poses to " + frameMetadataPath);
    });
  }
}

//888888888888888888888888888888888888888888888888888888888888888888//

if (process.argv.length !== 3) throw new Error("Usage: yarn run <image-file>");

const framesDirPath = process.argv[2];

//List Files in framesDirPath
console.log("- Read all PNG files");
let files = fs.readdirSync(framesDirPath).filter((fn) => fn.endsWith(".png"));

console.log("- Create Manifest File");
let manifestPath = framesDirPath + "manifest.json";
fs.writeFileSync(manifestPath, JSON.stringify(files));

console.log("- Create Pose Data for each frame");
fetchFrames(framesDirPath);

exit;
//-----------------------------------------------------------------
/*
const imagePath = process.argv[2];
const frameMetadataPath =
  imagePath.replace("/frames/", "/frames_metadata/") + ".json";

console.log(frameMetadataPath);

let poses = classify(imagePath);

poses.then((val) => {
  console.log("promise done!");
  //console.log(val);

  let data = JSON.stringify(val);
  fs.writeFileSync(frameMetadataPath, data);
  console.log("done writing!");
});
*/
