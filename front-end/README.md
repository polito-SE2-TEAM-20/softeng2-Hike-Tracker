# HackTheHike

## Team
### s292447 Sagristano Vincenzo
### s297925 Battipaglia Antonio
### s300744 Gorodnev German
### s303968 Zurru Laura
### s296962 Grande Francesco
### s301290 Gholami Erfan

## React Client Application Routes

- Route `/`: main page in which, based on whether the user is logged in or not, there will be shown welcoming contents like suggested hikes or some information about the website.
- Route `/listofhikes`: there is a page divided in two parts: a list of hikes (represented by means of cards) and a proper filter box.
- Route `/listofhuts`: there is a page divided in two parts: a list of huts (represented by means of cards) and a proper filter box.
- Route `/browsehikes`: there is a map containing all the markers for each hike. After clicking on a marker, an info box is displayed and clicking on its buttons it's possible to see more information about the hike or see its path on the map.
- Route `/login`: in this page the user can log in by means of their credentials.
- Route `/signup`: in this page, it's possible to sign up as a hiker, a local guide or a hut worker. An email is sent and, after having clicked on the link in the email, the administrator will be in charge of accepting either new local guides and new hut workers.
- Route `/newHut`: here it's possible to create a new hut following a three-step procedure and selecting the location point on the map.
- Route `/myHuts`: lists all the hut in which an hut worker works.
- Route `/myHikes`: lists all the hikes created by a local guide.
- Route `/showhike/:hikeid`: this page contains all the information about a single hike.
- Route `/showhut/:hutid`: this page contains all the information about a single hut.
- Route `/newParking`: here it's possible to create a new parking lot following a three-step procedure and selecting the location point on the map.
- Route `/edithike/:hikeid`: in this page the local guide can edit all the information about their hike.
- Route `/newHike`: here the user can create a new hike, filling the form with all the information related to the hike and uploading a GPX file containing all the points of the path.
- Route `/hikerdashboard`: in this dashboard the hiker is able to set all their preferences such that the website will propose them the hikes that best fits their needings and tastes.
- Route `/admindashboard`: in this dashboard the admin is able to accept the incoming requestes in order to complete the registration of local guides and hut workers.
- Route `/hutWorkerHuts`: lists all the hut owned by the logged hut worker.
- Route `/edithut/:hutid`: in this page the hut worker can edit all the information about their hut.
- Route `/hutWorkerHuts/linkedHikes`: in this page there is a list of all the hikes linked to a certain hut in which the hut worker can edit all the conditions for each hike.

## API Server

- GET `/api/admins`
  - Request parameter: empty
  - Response body: list of users
- GET `/api/surveys`
  - No parameters, empty request body
  - Response body: list of all surveys
- GET `/api/surveys/admin/:ID`
  - Request parameter: Admin ID
  - Response body: list of surveys associated to a given admin
- GET `/api/surveys/ID/:ID`
  - Request parameter: Survey ID
  - Response body: a survey given its ID
- GET `/api/s2u/:SID`
  - Request parameter: ID which associate a survey to an username
  - Response body: an object containing the surveyID, the username and the SID.
- GET `/api/surveys/ans/:QID/:S2U`
  - Request parameter: questionID and S2U, which is an identificator to univocally bend a username to a survey during the compiling phase
  - Response body: answers to the question identified by the QID.
- GET `/api/surveys/questions/:ID`
  - Request parameter: surveyID
  - Response body: list of questions by a given surveyID
- GET `/api/surveys/checkbox/:ID`
  - Request parameter: questionID
  - Response body: list of checkboxes by a given questionID
- POST `/api/surveys/add`
  - Request body: 
  - ```{
        title: request.body.title,
        q_amount: request.body.q_amount,
        n_response: request.body.n_response,
        admin_id: request.body.admin_id
        }```
  - Response body: list of surveys associated to a given admin
- GET `/api/surveys/lastID`
  - Request parameter: empty
  - Response body: get the lastID inserted into ```surveys``` table
- POST `/api/surveys/question/add`
  - Request body: ```{
        q_title: request.body.title,
        type: request.body.type,
        s_id: request.body.s_id,
        order: request.body.order,
        min: request.body.min,
        max: request.body.max
    }```
  - Response body: empty
- GET `/api/surveys/question/lastID`
  - Request parameter: empty
  - Response body: get the lastID inserted into ```questions``` table
- POST `/api/surveys/checkbox/add`
  - Request parameter: ```{checkbox.content, checkbox.q_id}```
  - Response body: empty
- POST `/api/surveys/answer`
  - Request body: ```{
            s_id: request.body.s_id,
            user: request.body.user
        }```
  - Response body: empty
- GET `/api/surveys/answer/lastID`
  - Request parameter: empty
  - Response body: get the lastID inserted into ```answers``` table
- POST `/api/surveys/answer/add`
  - Request parameter: a single answer
  - Response body: empty
- PATCH `/api/surveys/updateAmount/:sid`
  - Request parameter: the survey id of which we want to increment the amount of response received
  - Response body: empty
- POST `/api/sessions`
  - Request parameter: empty
  - Response body: empty
- DELETE `/api/sessions/current`
  - Request parameter: empty
  - Response body: empty
- GET `/api/sessions/current`
  - Request parameter: empty
  - Response body: empty

## Database Tables

- Table `admins` - contains id email name hash
- Table `answers` - contains id s2u_id q_id content_text content_check
- Table `checkboxes` - contains id content q_id
- Table `questions` - contains id q_title type s_id order min max
- Table `s2u` - contains id s_id user
- Table `surveys` - contains id title q_amount n_response admin_id date

## Screenshot

![Screenshot](./src/extra/img.png)

## Users Credentials

- username, password (plus any other requested info)
- vivi@polito.it, myself - List of surveys: Pokémon: how much do you know about it?, Summer days: pick up your destination!, Favorite color, What kind of vegetable are you?
- fulvio.corno@polito.it, fulviocorno - List of surveys: CPD: Web Application I, Next lecture day
- andy@friends.com, friends - List of surveys: Scotland: a great country!
- sibilla@gmail.com, sissisissi - List of surveys: empty
- guest@guest.com, guestguest - List of surveys: empty
