# HackTheHike
Application for promoting hiking activities in the mountains, fostering group activities through collaborative track of hikes, leveraging the network of mountain huts, ease safety operations in case of incidents/emergencies.

## Team
### s292447 Sagristano Vincenzo
### s297925 Battipaglia Antonio
### s300744 Gorodnev German
### s303968 Zurru Laura
### s296962 Grande Francesco
### s301290 Gholami Erfan
## Table of Contents

- [Clone the project](#clone-the-project)
- [Usage](#usage)
    - [Docker](#docker)
    - [Local](#local)
- [Screenshot](#screenshot)
- [User Credentials](#user-credentials)

## Clone the project

Use following command to download the project:
```sh
$ git clone git@github.com:polito-SE2-TEAM-20/softeng2-Hike-Tracker.git
```

## Usage
There are two ways for running our project: locally or using Docker images.

### Docker

At this link you can find the Docker images for running HackTheHike:
[https://hub.docker.com/r/germangorodnev/se2-team20](https://hub.docker.com/r/germangorodnev/se2-team20)

All information required to run the project with docker is given there in `Installation` section.

#### User credentials for docker
- Email: german@hiker.it --- password: 123456 (HIKER)
- Email: francesco@friend.it --- password: lqeodp (FRIEND)
- Email: antonio@localguide.it --- password: qwerty (LOCAL GUIDE)
- Email: vincenzo@admin.it --- password: asdfgh (PLATFORM MANAGER)
- Email: erfan@hutworker.it --- password: 098765 (HUT WORKER)
- Email: laura@emergency.it --- password: hetise (EMERGENCY OPERATOR)

There are also 100 hut worker accounts with similar credentials:  
Email: `hutWorker{i}@gmail.com`  
Password: `soundsLike{i}`  
Where `{i}` is number 0 - 100.
Even `i`'s are approved by manager, odd ones are not (for example, `hutWorker10@gmail.com` is approved, `hutWorker9@gmail.com` is not)
         
### Local

Requirements:
- `nodejs`
- `npm` 
- `postgresql`

#### Backend setup
- Make sure postgres is running
- Create new database
- Install postgis extension to it:
```sh
CREATE EXTENSION postgis;
```
- Execute: 
```sh
> cd backend
> cp .env.example .env
> npm install
```
- Put correct values into `backend/.env` file.

To run backend, execute
```sh
> npm run start:dev
```

#### Frontend setup
Execute the following commands to start using HackTheHike locally (the install commands will require some minutes):

```sh
> cd front-end
> npm install
> npm start
```

## Screenshot

![Screenshot](./front-end/src/extra/screenProj.png)

## User Credentials

- Email: provaMary@gmail.com --- password: qwertyMary (LOCAL GUIDE)
- Email: provaMark@gmail.com --- password: qwertyMark (LOCAL GUIDE)
- Email: provaMike@gmail.com --- password: qwertyMike (LOCAL GUIDE)
- Email: vepapav822@cosaxu.com --- password: qwerty  (LOCAL GUIDE)
- Email: cicicoco.1234@libero.it --- password: qwertyAndrea (HUT WORKER)
- Email: xesica8246@covbase.com --- password: qwerty (HUT WORKER)
- Email: docorix637@cnogs.com --- password: qwerty (HUT WORKER)
- Email: provaAdam@gmail.com --- password: qwertyAdam (HIKER)
- Email: provaPeter@gmail.com --- password: qwertyPeter (HIKER)
- Email: premierensp@gmail.com --- password: qwerty (PLATFORM MANAGER)