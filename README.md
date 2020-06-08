
# Foxfit

![preview](https://github.com/kylebot0/foxfit/blob/master/wiki-assets/Dagdoelen/Dagdoel_2.png)
## Table of Contents 🗃

- [Live demo](#Live-demo)
- [Introduction](#Introduction)
- [Different kinds of data](#Different-kinds-of-data)
- [Grid](#Grid)
- [Data](#Data)
- [Features](#Features)
  - [Mapbox](#Mapbox-implementation)
  - [Grid](#Grid)
  - [Filtering](#Filtering)
  - [Heatmap](#Heatmap)
  - [Bar charts](#Bar-chart)
- [Functionality](#Functionality)
- [Installation](#Installation)
  - [Before you clone](#Before-you-clone)
  - [Install the app](#Install-the-app)
  - [Usage](#Usage)
  
## Live demo

[You can find the demo here](https://foxfit.herokuapp.com/)

## Introduction 📝

The Foxfit platform is a mobile application for children and a website for care counselors that aims to treat children with asthma by motivating and supporting them to exercise more. Foxfit is part of the SIMBA study and is currently conducting a pilot.

Treating asthma
Foxfit works with a exercise monitor to help children with asthma plan and actually perform their exercise activities. Developed by [GainPlay Studio](https://www.gainplaystudio.nl/) in close collaboration with the [Amsterdam University of applied sciences](https://www.hva.nl/).

## Debriefing
For more details on our assignment, please check out the [debriefing document](https://github.com/kylebot0/foxfit/wiki/Debriefing)

## Collaboration
For detailed information on collaboration, visit [this wiki page](https://github.com/kylebot0/foxfit/wiki/Collaboration)

## Data
(Data verhaal)

## Features 🛠️

### Mapbox implementation

### Grid


### Bar chart
Next to the filters i make a couple of bar charts, so that you can easily see how much every filters contains.
Each bar is connected to the filter next to it, so if you click it fills itself with a lightgrey color. This way you can see if it's inactive or not.
![preview](https://github.com/kylebot0/Project_thorikos/blob/master/gh-images/Schermafbeelding%202020-01-22%20om%2020.15.57.png)

### Too long to read
- [x] Mapbox implementation
- [x] Grid
- [x] Heatmap
- [x] Filtering
- [x] Connected bar chart
- [x] Legend


### Known Bugs

- Performance issues when clicking a lot of filters and then moving the map

### Upcoming features

- [ ] Switch modes
- [ ] Switch grid sizes


## Installation 🔍

### Before you clone

- [x] Install a Code Editor
- [x] Start up your CLI

### Install the app
```
https://github.com/kylebot0/foxfit.git
```
Get into the right folder
```
cd foxfit
```
Install the dependecies
```
npm i
```
Make a .env file
```
Touch .env
```
Edit the variables in the .env file
```
HOSTNAME=...
HOSTPORT=...
DATABASE=...
DBUSERNAME=...
PASSWORD=...
```

Then you can start the application with:
```
npm run start
```

### Gitignore
My .gitignore contains all of the files and maps you dont want in your application, use this if you're going to commit and push to your own repo.
```
# dependencies
/node_modules
/config
/scripts

# testing
/coverage

# production
/build

# misc
.DS_Store
.env
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

### Usage

Start the application
```
Open it up in your finder / explorer
```

Then it should fire up a localhost in your browser, if that's not the case use this in your address bar.
```
localhost:9000 || Or the port that you setup
```

## Credits

- -


## License
Find the license [here](https://github.com/kylebot0/foxfit/blob/master/LICENSE)



