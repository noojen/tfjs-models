

# PoseNet Processor Tool

## Contents

### Processor Description

Takes a folder of frames pngs and processes each from by running Posenet on top and writing pose data to a metadata folder (frames-metadata).


** We assume you generated frames and frame-metadata by using the provided scripts in the ```/posenet/processor``` folder

    - [x] FFMpeg https://scikit-image.org/docs/dev/user_guide/video.html
    - [x] FFMpeg - get framerate https://askubuntu.com/questions/110264/how-to-find-frames-per-second-of-any-video-file
    - [x] FFMpeg - test on two videos (Arden moving) -
        - [x] ffmpeg -i "video.mov" -f image2 "video-frame%05d.png"

## Setup

cd into the ```processor``` folder:

```sh
cd posenet/processor
```

Install dependencies and prepare the build directory:

```sh
yarn install
```

(OPTIONAL) To use local tensorflow posenet model

```sh
yarn yalc link @tensorflow-models/posenet
```

To process frames into frame metadata run the following:

```sh
processor> yarn run a ~/activity-videos/running/frames/00/
```

