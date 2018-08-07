# project-betting-server

- Betting/Poker app that lets a host invite friends to a betting session or to play poker.

## User Stories

  **404:** As an anon/user I can see a 404 page if I try to reach a page that does not exist so that I know it's my fault
  
  **Signup:** As an anon I can sign up in the platform so that I can start saving favorite restaurants
  
  **Login:** As a user I can login to the platform so that I can see my favorite restaurants
  
  **Logout:** As a user I can logout from the platform so I can stop using it 

  **List Events** As a user I want to see the events so that I can choose one to apply for
  
  **Event Details** As a user I want to see the details of the event so that I know who created it so I can apply

  **Create Event** As a user I want to be able to create an Event so that I can save arrange a social setting with my friends

  **See my event** As a user I want to see my Event so that I can see the details of the event.
  
  **Edit events** As a user I want to edit my event so that it suits every one involved.
  
  **Apply for event** As a user I want to be able to apply for events that my friend has created so that i can get full info beforehand.
  
  **Decide on Applications** As a user can choose who participates in my events, hence enabling me to accept or reject users
    
  **Search User** As a user i want to be able to search for a user so that I can find events created by my friends easily.
    
    
## Backlog

  **Profile** As a user I would like to see my stats for previous events so that i can see my, for example Win/Loss ratio.
  
  **Delete Event** As a user i want to be able to delete events in case I don't get enough participants

  **Anon User** As an anonymous user I want to see a events so that I can decide wether to sign up or not.
  
  **Add location to events** As a user I can see where the event takes place so that i can plan my journey
  
  **See the stakes** As a user i can see the stakes of the events so that I can decide on wether it's to high or low stakes.
  
  **(Fake) Bets**  As a user i can bet directly in the app, so that I don't have to worry about bringing cash
  
# Client

## Routes

  - / - Homepage
  - /auth/signup - Signup form
  - /auth/login - Login form
  - /events - Event list
  - /events/:id - Event details
  - /profile/me - my details, events created by me, applicants to my events, see events I applied to

## Services

- Auth Service
  - login(user)
  - signup(user)
  - logout()
  - me()
  - getUser()
- Events Service
  - getAll()
  - getOne(id)   
  - createOne(data)
  - applyOne(id) --- make sure to only allow one application/person/event
  - confirm(eventId, applicationId, status)

## Pages

- 404 Page
- 500 Page
- Sign in Page
- Log in Page
- Events List Page (Home Page)
- Events Detail Page
- My Profile Page

## Components

- Event-List component @Input(): events
- Event-Card component @Input(): event

## IO

- Events List Page inputs Profile-Upcoming Events component and Profile-My-Events component: Display events I am about to attend and display events I have created

## Guards

1. RequireAnon
2. RequireUser
3. AuthInit

/ --- AuthInit (Everyone can access)
/ login --- RequireAnon (only users that are not logged in can visit)
/ signup --- RequireAnon (only users that are not logged in can visit)
/ profile --- RequireUser (only a user can access a profile, if CurrentUser - see stats, upcoming events, my events, applications. If not CurrentUser - see my events and apply)
/ create-event --- RequireUser (only a logged in user is able to create an event)
/event/:id --- InitAuth (everyone can see details of events, but only attendants of the events can see location, stakes and details)

# Server

## Models

  User model

  ```
  User {
    username: {
      type: string,
      required: true
      unique: true
    },
    email: {
      type: string,
      required: true
      unique: true
    },
    password: {
      type: string,
      required: true
    }
  }
  ```

  Event model

  ```
  const event = {
  name: {
    type: string,
    required: true
  },
  applications: [{
    type: string,
    user: ObjectId,
    status: enum=[pending, accepted, rejected] ------ subSchema = own objectId
  }],
  
  owner: ObjectId,
  
  category: [{
    type: enum=[poker, fifa, racketgames, golf, football, other],
    default: other
  }],
  
  // Backlog
  details: [{
  location: String,
  date: Date,
  details: String
  }]
  
  stakes: 
}
```

## API Endpoints/Backend Routes

  - GET /auth/me
  - POST /auth/signup
  - POST /auth/login
  - POST /auth/logout
  
  - GET /events
  - POST /events ---- create
  - GET /events/:id
  - POST /events/:id/applications ---- apply, Body?
  - PUT /events/:id/applications/:applicationsId ---- reject or confirm = send status in the body, not in URL
  - POST /events/:id ---- update
