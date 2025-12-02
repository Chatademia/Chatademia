# The server is configured to run as a docker container
### Here is how to build it:

- Install Docker https://docs.docker.com/desktop/setup/install/windows-install/
- Run the docker engine (opening downloaded docker dektop should do it)
- Open a terminal and navigate to the `/server` directory of the project.
- Rename the `.env.example` to `.env` and fill in all the values
- `docker-compose up --build`
- The api should now be available at http://localhost:8080/, like http://localhost:8080/weatherforecast
- The documentation and visualization are now available at http://localhost:8080/scalar/v1


### When you're done testing or want to rebuild the image from scratch:
- `docker-compose down -v`

# API
### User flow: 
```mermaid
flowchart TD
A[User on Welcome Page]:::WEBAPP --> |User Clicks Login| C[Webapp calls GET /api/auth/login-url<br/>with callback URL]:::WEBAPP
C --> B[API creates temp_user with ouath_tokens, returns Login URL]:::SERVER
B --> E[Webapp redirects User to Login URL]:::WEBAPP

E --> |User logs in with USOS| D[USOS redirects back<br/>with oauth_token & oauth_verifier]:::USOS
D --> H[Webapp calls POST /api/auth/session<br/>with oauth_token & oauth_verifier]:::WEBAPP
H --> F[API asks USOS for access token]:::SERVER
F --> |access_tokens present in db| G[API returns session_token, creates one if no exist]:::SERVER
F --> |access_tokens not in db| I[Add access_tokens to temp_user]:::SERVER
G --> J[Webapp stores session_token]:::WEBAPP
I --> P[API asks USOS for user]:::SERVER
P --> |Found user with recieved ID| T[Update found_user with access_tokens, user data and create session to be returned]:::SERVER
P --> |No user with recieved ID| R[API creates new user with recieved data and temp_user data]:::SERVER
R --> S[API creates and returns session_token for the user]:::SERVER
S --> J
T --> J

J --> K[Webapp makes requests passing session_token]:::WEBAPP
K --> |invalid session| C
K --> |valid session| U[Was stored data refreshed in 24h?]:::SERVER
U --> |yes| O[Webapp gets query results]:::WEBAPP
U --> |no| W[API syncs data with USOS]:::SERVER
W --> O
J --> |User clicks log out| L[Webapp calls DELETE /api/auth/session]:::WEBAPP
L --> |API sets session to null|A
K --> |User clicks log out| L
O --> |User clicks log out| L
O --> K

classDef USOS fill:#ffddaa,color:#000;
classDef WEBAPP fill:#aad7ff,color:#000;
classDef SERVER fill:#c6f5c6,color:#000;
```
