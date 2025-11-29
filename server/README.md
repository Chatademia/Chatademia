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
### Usage of API:
- User flow: 
  - User visits the welcome page
  - User clicks the “Login” button
  - Webapp calls `GET /api/Auth/login-url` with the desired callback page as a parameter
  - API returns a login URL, which the webapp redirects the user to
  - After successful login, the webapp receives `oauth_token` and `oauth_verifier` from the OAuth callback
  - Webapp calls `GET /api/Auth/access-token` and passing oauth_token and oauth_verifier as parameters
  - API returns the `access_token`, which becomes the user’s session token
  - For all subsequent API requests, the webapp includes this `access_token` to authenticate the user

