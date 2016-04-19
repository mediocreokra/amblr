# Amblr
When you’re walking around the city, you want to enjoy the fun and interesting things and avoid the dangerous / gross stuff. Amblr lets you share points of interest with other users and lets you see what other have added. It’s kind of like Waze, but for walkers.

## Team

  - __Product Owner__: Toben
  - __Scrum Master__: Alex
  - __Development Team Members__: Trini, Bryan

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

When you load the app, you'll see a Google Map where you can add a point of interest (POI) at your current location by clicking a menu link or at any location by touching and holding on the map for 1 second. After adding a POI, you can add details and save it to the database. Touch existing POIs to see the details.

Sign In and Sign Out features are implemented with Passport.js, but they do not restrict user functions yet.

## Requirements

### Stack
MongoDB 2.1.16
Express 4.13.4
Angular 1.4.3 with Ionic 1.2.4
Node 4.4.2


###NPM Modules

(For complete details, see package.json files in Server and Client folders, and bower.json in Client folder)


- Ionic 1.7.14
- Cordova 6.1.1
- ios-sim 5.0.8
- ios-deploy 1.8.5
- Apple XCode
- Java SE Development Kit 7 or later
- Android Standalone SDK Tools
- Node 4.4.2
- Express 4.13.4
- Karma
- Karma-Jasmine
- Karma-Chrome-Launcher
- MongoDB 2.1.16
- Grunt 
- Gulp 3.9.1
- Mocha
- Chai
- Sinon
- Winston
- Morgan


###Bower Components
- ngCordova
- angular-mocks 1.4.3


## Development

Server logging will be done both in the console and to /server/logs/log.log.
Log level can be configured in /server/config/logger.js

### Installing Dependencies

From within the ```client``` directory:

```sh
npm install
bower install
```

From within the ```server``` directory:

```sh
npm install
grunt server-dev
```

### Roadmap

View the project roadmap [here](https://github.com/mediocreokra/amblr/issues)


## Contributing

See [CONTRIBUTING.md](https://github.com/mediocreokra/amblr/blob/master/_CONTRIBUTING.md) for contribution guidelines.
