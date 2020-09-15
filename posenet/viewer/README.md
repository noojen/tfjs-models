# PoseNet Viewer Tool

## Contents


## Quickstart

```sh
1. In tfjs-models/posenet/

		> yarn install
		> yarn publish-local

2. In tfjs-models/posenet/demos

		> yarn install
		> yarn yalc link @tensorflow-models/posenet
		> yarn watch

3. ** Every time you update the TensorFlow-models/postnet local code,

run > yarn publish-local

and then the the demo running with yarn watch will pick up the changes and load the new local dependency.

Reference: https://github.com/tensorflow/tfjs-models/blob/707c3603972f9b08ce330ade5cabee1777d9f454/body-pix/demos/README.md
```

### Viewer Description

Simple Web Interface that will let you view the frames in a video and draw Posenet poses from a frame-metadata folder (instead of generating them on the fly as you get in the ```/posenet/demos/``` folder)

We assume you generated frames and frame-metadata by using the provided scripts in the ```/posenet/processor``` folder
## Setup

cd into the ```viewer``` folder:

```sh
cd posenet/viewer
```

Install dependencies and prepare the build directory:

```sh
yarn install
```

(OPTIONAL) To use local tensorflow posenet model [ **scroll down for instructions to publish posenet locally** ]

```sh
yarn yalc link @tensorflow-models/posenet
```

Add symlinks to generated videos, frames, frame-metadata

Ex. Assuming files are on your local filesystem in the ```~/activity-videos/running/``` folder

```sh

> cd viewer/dist

~/viewer/dist/videos -> ~/activity-videos/running/videos/
> ln -s ~/activity-videos/running/videos/ videos

~/viewer/dist/running/frames -> ~/activity-videos/running/frames/
> ln -s ~/activity-videos/running/frames/ frames

~/viewer/dist/running/frames-metadata/ -> ~/activity-videos/running/frames-metadata/
> ln -s ~/activity-videos/running/frames_metadata/ frames_metadata
```

To watch files for changes, and launch a dev server:

```sh
yarn watch
```

## If you are developing posenet locally, and want to test the changes in the viewer/processer/demos folders

### Same general instructinons apply for processor and viewer folders

Cd into the posenet folder:
```sh
cd posenet
```

Install dependencies:
```sh
yarn
```

Publish posenet locally:
```sh
yarn build && yarn yalc publish
```

Cd into the demos and install dependencies:

```sh
cd demos
yarn
```

Link the local posenet to the demos:
```sh
yarn yalc link @tensorflow-models/posenet
```

Start the dev demo server:
```sh
yarn watch
```

To get future updates from the posenet source code:
```
# cd up into the posenet directory
cd ../
yarn build && yarn yalc push
```

To remove local posenet:
```sh
> cd posenet
> yarn yalc remove @tensorflow-models/posenet
> cd demos
> yarn yalc remove @tensorflow-models/posenet
> cd viewer (if using...likely not)
> yarn yalc remove @tensorflow-models/posenet
> cd processory (if using...likely possible)
> yarn yalc remove @tensorflow-models/posenet
```
Remove all the ~~~.yalc, node_modules, .cache~~~ folders and do a fresh ~~~yarn install~~~


