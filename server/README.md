# The server is configured to run as a docker container
### Here is how to build it:

- Install Docker https://docs.docker.com/desktop/setup/install/windows-install/
- Run the docker engine (opening downloaded docker dektop should do it)
- Open a terminal and navigate to the /server directory of the project.
- `docker-compose up --build`
- The api should now be available at http://localhost:8080/, like http://localhost:8080/weatherforecast


### When you're done testing or want to rebuild the image from scratch:
- `docker stop chatademia-server`
- `docker stop chatademia-postgres`
- `docker rm chatademia-server`
- `docker rm chatademia-postgres`
