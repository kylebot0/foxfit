
# Foxfit

![image](https://user-images.githubusercontent.com/43671292/84998641-66e4eb80-b150-11ea-857c-87e1a50a3bf6.png)
## Table of Contents 🗃

- [Foxfit](#foxfit)
  - [Table of Contents 🗃](#table-of-contents-)
  - [Live demo](#live-demo)
  - [Introduction 📝](#introduction-)
  - [Debriefing](#debriefing)
  - [Collaboration](#collaboration)
  - [Data](#data)
  - [Features 🛠️](#features-️)
    - [Compare motion](#compare-motion)
    - [Date and day](#date-and-day)
    - [Slider for comparison](#slider-for-comparison)
    - [Comparing feeling and movement](#comparing-feeling-and-movement)
    - [Morning and evening feel](#morning-and-evening-feel)
    - [Scores of all weeks](#scores-of-all-weeks)
    - [Discover planets](#discover-planets)
    - [Score graph](#score-graph)
    - [Too long to read](#too-long-to-read)
    - [Known Bugs](#known-bugs)
    - [Upcoming features](#upcoming-features)
  - [Installation 🔍](#installation-)
    - [Before you clone](#before-you-clone)
    - [Install the app](#install-the-app)
    - [Gitignore](#gitignore)
    - [Usage](#usage)
  - [Credits](#credits)
  - [License](#license)
  
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
Our data is picked up from the FoxFit database with SQL queries. On [this wiki page](https://github.com/kylebot0/foxfit/wiki/Data-object), you can read more about the original format of this data. We also made a scheme to visualize the relations between the different data tables, which can be found on [this wiki page](https://github.com/kylebot0/foxfit/wiki/Data-Analysis).

To be able to use this data the way we want, we set up an API endpoint in `app.js`. The multiple endpoints and the way it can be used is explained [here](https://github.com/kylebot0/foxfit/wiki/Code#api).

## Features 🛠️

### Compare motion
<img src="https://github.com/kylebot0/foxfit/blob/master/public/images/gifs/beweging_grafiek.gif" width="500" />
With this graph you can easily view the child's movement with different weeks, and you can also filter the activity by pressing the check mark in the legend.

### Date and day
<img src="https://github.com/kylebot0/foxfit/blob/master/public/images/gifs/datum_beweging_grafiek.gif" width="500" />
Each week you can see the days of the different bars on the side. If you hover over the day you will see the date of that bar / day.

### Slider for comparison
<img src="https://github.com/kylebot0/foxfit/blob/master/public/images/gifs/slider_beweging_grafiek.gif" width="500" />
To make comparisons easier, you can put a slider on either side of the graphs. With this slider, a line is drawn at the same points on the axis. To remove this slider you can press "R".

### Comparing feeling and movement
<img src="https://github.com/kylebot0/foxfit/blob/master/public/images/gifs/gevoel_grafiek.gif" width="500" />
This graph shows how the child felt per week and how much the child has moved each week. This allows the caregiver to observe the effect of movement on the child's mood and to see it every week. The different intensity groups can be turned off and on in the graph by clicking the checkmarks in the legend.

### Morning and evening feel
<img src="https://github.com/kylebot0/foxfit/blob/master/public/images/gifs/gevoel_hover_grafiek.gif" width="500" />
By moving the mouse over the different bars of the bottom graph, the exact figure for each morning and evening is visible. In addition to the course of the whole week, the results can also be seen per day.

### Scores of all weeks
<img src="https://github.com/kylebot0/foxfit/blob/master/public/images/gifs/scores_grafiek.gif" width="500" />
With the scores graph you can compare the scores of each week, there is also a line to indicate the daily goal. To compare all weeks, you can select "All weeks" in the dropdown menu.

### Discover planets
<img src="https://github.com/kylebot0/foxfit/blob/master/public/images/gifs/kinderen_grafiek.gif" width="500" />
As soon as every week is over, a new planet is discovered. The client can also give a trophy that will be placed above the planet.

### Score graph
<img src="https://github.com/kylebot0/foxfit/blob/master/public/images/gifs/kinderen_hover_grafiek.gif" width="500" />
You can also click on a planet, where the week is visible and a graph is made with the feelings of the children. You can also see the accompanying trophy. If the week is halfway completed, a graph will still be created.


### Too long to read
- [x] Compare motion
- [x] Date and day
- [x] Slider for comparison
- [x] Morning and evening feel
- [x] Comparing feeling and movement
- [x] Scores of all weeks
- [x] Discover planets
- [x] Score graph


### Known Bugs

- Rocket sometimes goes off the screen.

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

- Annette Brons for providing feedback throughout the process.


## License
Find the license [here](https://github.com/kylebot0/foxfit/blob/master/LICENSE)



