# Intro

**Containers** encapsulate your application into a single package. This package will then include all of the dependencies with the application. As a result, each container can run isolated from the other containers.

_Scenario 1: You are developing a new application that needs to run on the same machine as a legacy application. Both require different versions of Node installed._

You can probably use nvm, virtual machines, or dark magic to get them running at the same time. However, containers are an excellent solution as you can run both applications in their respective containers. They are isolated from each other and do not interfere.

_Scenario 2: Your application runs on your machine. You need to move the application to a server._

It is not uncommon that the application just does not run on the server despite it works just fine on your machine. It may be due to some missing dependency or other differences in the environments. Here containers are an excellent solution since you can run the application in the same execution environment both on your machine and on the server. It is not perfect: different hardware can be an issue, but you can limit the differences between environments.

## Basics

https://tkt-lapio.github.io/command-line/

### The command line

The former is an example of a _graphical user interface (GUI)_: The possible actions are presented in some sort of menu and chosen by clicking. Files can also be drag and dropped to new places. Contrary to the graphical user interface, the command line is a _text-based user interface_. This means that one does not use the mouse for choosing specific actions. Instead, the computer is given commands by writing them and pressing enter.

## Commands

The command "ls -la" is commonly used in Unix-based systems, such as Linux and macOS, to list files and directories, including hidden ones, in a long format. However, in PowerShell, the equivalent command is "Get-ChildItem -Force".

In a Unix-like environment, this is done with the command `mkdir`, abbreviated from “make directory”. The command is given the name of the new folder as an argument.

## Containers and images

A container is a runtime instance of an image.

Both of the following statements are true:

- Images include all of the code, dependencies and instructions on how to run the application
- Containers package software into standardized units

But you can never actually build a container or download one since containers only exist during runtime. Images, on the other hand, are immutable files. As a result of the **immutability**, you can not edit an image after you have created one. However, you can use existing images to create a new image by adding new layers on top of the existing ones.

Cooking metaphor:

- Image is pre-cooked, frozen treat.
- Container is the delicious treat.

Let us start with the command docker container run that is used to run images within a container. The command structure is the following: `container run IMAGE-NAME` that we will tell Docker to create a container from an image. A particularly nice feature of the command is that it can run a container even if the image to run is not downloaded on our device yet:

    $ docker container run hello-world

The two options, or flags, `-it` make sure we can interact with the container. After the options, we defined that image to run is `ubuntu`. Then we have the command `bash` to be executed inside the container when we start it.

    $ docker container run --help

    Usage:  docker container run [OPTIONS] IMAGE [COMMAND] [ARG...]
    Run a command in a new container

    Options:
        ...
        -i, --interactive                    Keep STDIN open even if not attached
        -t, --tty                            Allocate a pseudo-TTY
        ...

As an example try `docker container run --rm ubuntu ls`. The `ls` command will list all of the files in the directory and `--rm` flag will remove the container after execution. Normally containers are not deleted automatically.

We can list all of the containers with `container ls -a`, the `-a` (or `--all`) will list containers that have already been exited. A shortcut we can use is `docker ps -a`. We can start it again with the start command that will accept the id or name of the container as a parameter: `start CONTAINER-ID-OR-CONTAINER-NAME`.

    $ docker start hopeful_clarke
    hopeful_clarke

Let's kill it with the `kill CONTAINER-ID-OR-CONTAINER-NAME` command and try again.

    $ docker kill hopeful_clarke
    hopeful_clarkecopy

`docker kill` sends a **signal SIGKILL** to the process forcing it to exit, and that causes the container to stop.

Now let us start the container again, but this time in interactive mode:

    $ docker start -i hopeful_clarke

Let's edit the file index.js and add in some JavaScript code to execute. We are just missing the tools to edit the file. Nano will be a good text editor for now. The install instructions were found from the first result of Google. We will omit using sudo since we are already root.

    root@b8548b9faec3:/# apt-get update
    root@b8548b9faec3:/# apt-get -y install nano
    root@b8548b9faec3:/# nano /usr/src/app/index.js

The instructions for installing Node are sometimes hard to find, so here is something you can copy-paste:

    curl -sL https://deb.nodesource.com/setup_16.x | bash
    apt install -y nodejs

The command

    commit CONTAINER-ID-OR-CONTAINER-NAME NEW-IMAGE-NAME

will create a new image that includes the changes we have made. You can use container diff to check for the changes between the original image and container before doing so.

    $ docker commit hopeful_clarke hello-node-world

We will clean the slate with `container rm` to remove the old container.

There are plenty of useful Docker images in Docker Hub ready for our use. Let's use the image https://hub.docker.com/_/Node, which has Node already installed. The `container run` accepts `--name` flag that we can use to give a name for the container.

    $ docker container run -it --name hello-node node:16 bash

While we are inside the container on this terminal, open another terminal and use the container cp command to copy file from your own machine to the container.

    $ docker container cp ./index.js hello-node:/usr/src/app/index.js

# Building and configuration of environments

## Dockerfile

The resulting Dockerfile looks like this:

    FROM node:16

    WORKDIR /usr/src/app

    COPY ./index.js ./index.js

    CMD node index.jscopy

`FROM` instruction will tell Docker that the base for the image should be node:16. `COPY` instruction will copy the file index.js from the host machine to the file with the same name in the image. `CMD` instruction tells what happens when docker run is used. `CMD` is the default command that can then be overwritten with the parameter given after the image name.

The `WORKDIR` instruction was slipped in to ensure we don't interfere with the contents of the image. It will guarantee all of the following commands will have `/usr/src/app` set as the working directory. If the directory doesn't exist in the base image, it will be automatically created. If we do not specify a `WORKDIR`, we risk overwriting important files by accident.

    $ docker build -t fs-hello-world .

One more thing: in above it was mentioned that the default command, defined by the CMD in the Dockerfile, can be overridden if needed. We could e.g. open a bash session to the container and observe it's content:

    $ docker run -it fs-hello-world bash

## express-generator

Lets use express-generator to create a basic Express application skeleton. Note that the command to run the application may be different from you, my directory was called playground.

    $ npx express-generator
    ...

    install dependencies:
        $ npm install

    run the app:
        $ DEBUG=playground:* npm start

Let's build the image from the Dockerfile with a command, `docker build -t express-server .` and run it with `docker run -p 3123:3000 express-server`. The `-p` flag will inform Docker that a port from the host machine should be opened and directed to a port in the container. The format is `-p host-port:application-port`.

By the way, when using id as the argument, the beginning of the ID is enough for Docker to know which container we mean.

## ci

The `npm install` can be risky. Instead of using npm install, npm offers a much better tool for installing dependencies, the `ci` command.

Differences between `ci` and install:

- install may update the `package-lock.json`
- install may install a different version of a dependency if you have ^ or ~ in the version of the dependency.
- `ci` will delete the node_modules folder before installing anything
- `ci` will follow the package-lock.json and does not alter any files

Even better, we can use `npm ci --only=production` to not waste time installing development dependencies.

## Debugging express

http://expressjs.com/en/guide/debugging.html#debugging-express

## Rules of thumb

There are 2 rules of thumb you should follow when creating images:

- Try to create as secure of an image as possible
- Try to create as small of an image as possible

Snyk has a great list of 10 best practices for Node/Express containerization: https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/

## Docker compose

Docker compose is another fantastic tool, which can help us to manage containers.

https://docs.docker.com/compose/compose-file/compose-file-v3/

Versioning: https://docs.docker.com/compose/compose-file/compose-versioning/

Create the file docker-compose.yml and place it at the root of the project, next to the Dockerfile. The file content is

    version: '3.8'            # Version 3.8 is quite new and should work

    services:
    app:                    # The name of the service, can be anything
        image: express-server # Declares which image to use
        build: .              # Declares where to build if image is not found
        ports:                # Declares the ports to publish
        - 3000:3000

Now we can use `docker compose up` to build and run the application. If we want to rebuild the images we can use `docker compose up --build`. You can also run the application in the background with `docker compose up -d` (`-d` for detached) and close it with `docker compose down`.

## docker logs

    docker logs <id>

This command shows logs of the container you are running

## mongo image

Run in local machine with the mongodb:

    $ MONGO_URL=mongodb://localhost:3456/the_database npm run dev

With the correct username and password:

    $ MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database npm run dev

https://hub.docker.com/_/mongo

Create a new yaml called `todo-app/todo-backend/docker-compose.dev.yml` that looks like following:

    version: '3.8'

    services:
    mongo:
        image: mongo
        ports:
        - 3456:27017
        environment:
        MONGO_INITDB_ROOT_USERNAME: root
        MONGO_INITDB_ROOT_PASSWORD: example
        MONGO_INITDB_DATABASE: the_database

You can use `-f` flag to specify a file to run the Docker Compose command with e.g.

    docker compose -f docker-compose.dev.yml up

Now start the MongoDB with `docker compose -f docker-compose.dev.yml up -d`. With `-d` it will run it in the background. You can view the output logs with `docker compose -f docker-compose.dev.yml logs -f`. There the `-f` will ensure we follow the logs.

# bind mount

Bind mount is the act of binding a file (or directory) on the host machine to a file (or directory) in the container. A bind mount is done by adding a `-v` flag with container run. The syntax is `-v FILE-IN-HOST:FILE-IN-CONTAINER`. The bind mount is declared under key `volumes` in `docker-compose-yml`.

Run `docker compose -f docker-compose.dev.yml down --volumes` to ensure that nothing is left and start from a clean slate with `docker compose -f docker-compose.dev.yml up` to initialize the database.

## Persisting data with volumes

There are two distinct methods to store the data:

- Declaring a location in your filesystem (called bind mount)
- Letting Docker decide where to store the data (volume)

First option:

    volumes:
        ./mongo_data:/data/db

The above will create a directory called `mongo_data` to your local filesystem and map it into the container as `/data/db`. This means the data in `/data/db` is stored outside of the container but still accessible by the container!

Second option:

    volumes:
        - mongo_data:/data/db

Now the volume is created but managed by Docker. After starting the application (`docker compose -f docker-compose.dev.yml up`) you can list the volumes with `docker volume ls`, inspect one of them with `docker volume inspect` and even delete them with `docker volume rm`. The named volume is still stored in your local filesystem but figuring out where may not be as trivial as with the previous option.

## exec

The Docker command `exec` is a heavy hitter. It can be used to jump right into a container when it's running.

Let's start a web server in the background and do a little bit of debugging to get it running and displaying the message "Hello, exec!" in our browser. Let's choose Nginx which is, among other things, a server capable of serving static HTML files. It has a default `index.html` that we can replace.

    $ docker container run -d -p 8080:80 nginx

We will execute bash inside the container, the flags -it will ensure that we can interact with the container:

    $ docker exec -it <container_name> bash
    $ root@7edcb36aff08:/# cd /usr/share/nginx/html/
    $ root@7edcb36aff08:/# rm index.html
    $ root@7edcb36aff08:/# echo "Hello, exec!" > index.html

The Mongo CLI will require the username and password flags to authenticate correctly. `mongosh -u root -p example` should work, the values are from the docker-compose.dev.yml.

    $ show dbs
    $ use the_database
    $ show collections
    $ db.todos.find({})

## Redis

Redis is a _key-value_ database. In contrast to eg. MongoDB, the data stored to a key-value storage has a bit less structure, there are eg. no collections or tables, it just contains junks of data that can be fetched based on the key that was attached to the data (the value).

By default Redis works _in-memory_, which means that it does not store data persistently. An excellent use case for Redis is to use it as a cache.

Once Redis is configured and started, restart the backend and give it the ` REDIS_URL``, that has the form  `redis://host:port``

The project already has https://www.npmjs.com/package/redis installed and two functions "promisified" - getAsync and setAsync.

- `setAsync`` function takes in key and value, using the key to store the value.
- `getAsync`` function takes in key and returns the value in a promise.

### redis-cli

- Go to the Redis container with docker exec and open the redis-cli.
- Find the key you used with `KEYS *`
- Check the value of the key with command GET
- Set the value of the counter to 9001, find the right command from https://redis.io/commands/
- Make sure that the new value works by refreshing the page http://localhost:3000/statistics
- Create a new todo with Postman and ensure from redis-cli that the counter has increased accordingly
- Delete the key from cli and ensure that counter works when new todos are added

# Orchestration

## express.static

We could use our express.static with the Express server to serve the static files (https://expressjs.com/en/starter/static-files.html)

## serve

A valid option for serving static files now that we already have Node in the container is serve.

    root@98fa9483ee85:/usr/src/app# npm install -g serve

    added 88 packages, and audited 89 packages in 6s

    root@98fa9483ee85:/usr/src/app# serve build -n // added `-n` to remove error

    ┌────────────────────────────────────────┐
    │                                        │
    │   Serving!                             │
    │                                        │
    │   - Local:    http://localhost:3000    │
    │   - Network:  http://172.17.0.2:3000   │
    │                                        │
    └────────────────────────────────────────┘

## multiple stages

**Multi-stage builds** are designed for splitting the build process into many separate stages, where it is possible to limit what parts of the image files are moved between the stages.

With multi-stage builds, a tried and true solution like Nginx can be used to serve static files without a lot of headaches. The Docker Hub page for Nginx tells us the required info to open the ports and "Hosting some simple static content".

After we build it again, the image is ready to serve the static content. The default port will be 80 for Nginx, so something like `-p 8000:80` will work, so the parameters of the run command need to be changed a bit.

## Development in containers

Since the Dockerfile will be significantly different to the production Dockerfile let's create a new one called `dev.Dockerfile`.

Starting the create-react-app in development mode should be easy. Let's start with the following:

    FROM node:16

    WORKDIR /usr/src/app

    COPY . .

    # Change npm ci to npm install since we are going to be in development mode
    RUN npm install

    # npm start is the command to start the application in development mode
    CMD ["npm", "start"]

During build the flag `-f` will be used to tell which file to use, it would otherwise default to Dockerfile, so the following command will build the image:

    docker build -f ./dev.Dockerfile -t hello-front-dev .

The second task, accessing the files with VSCode, is not done yet. There are at least two ways of doing this:

- The Visual Studio Code Remote - Containers extension
- Volumes, the same thing we used to preserve data with the database

Let's go over the latter since that will work with other editors as well. The command `pwd` should output the path to the current directory for you. Try this with `echo $(pwd)` in your command line.

**Note: /"${PWD}" can also work. Quotes and slash can be removed on wsl CLI. On another note I also had to modify my scripts in the package.json to `"start": "WATCHPACK_POLLING=TRUE react-scripts start"`**

    $ docker run -p 3000:3000 -v /"$(pwd)":/usr/src/app/ hello-front-dev

    Compiled successfully!

    You can now view hello-front in the browser.

## Installing new dependencies

One of the better options is to install the new dependency inside the container. So instead of doing e.g. npm install axios, you have to do it in the running container e.g. `docker exec hello-front-dev npm install axios`, or add it to the `package.json` and run `docker build` again.

## Communication between containers in a Docker network

The Docker Compose tool sets up a network between the containers and includes a DNS to easily connect two containers. **Busybox** is a small executable with multiple tools you may need. It is called "The Swiss Army Knife of Embedded Linux", and we definitely can use it to our advantage. Busybox can help us to debug our configurations. So if you get lost in the later exercises of this section, you should use Busybox to find out what works and what doesn't.

The Busybox container won't have any process running inside so we can not exec in there. Because of that, the output of docker compose up will also look like this:

    $ docker compose up

    Pulling debug-helper (busybox:)...
    latest: Pulling from library/busybox
    8ec32b265e94: Pull complete
    Digest: sha256:b37dd066f59a4961024cf4bed74cae5e68ac26b48807292bd12198afa3ecb778
    Status: Downloaded newer image for busybox:latest
    Starting hello-front-dev          ... done
    Creating react-app_debug-helper_1 ... done
    Attaching to react-app_debug-helper_1, hello-front-dev
    react-app_debug-helper_1 exited with code 0

    hello-front-dev |
    hello-front-dev | > react-app@0.1.0 start
    hello-front-dev | > react-scripts start

**While the hello-front-dev is running**, we can do the request with wget since it's a tool included in Busybox to send a request from the debug-helper to hello-front-dev.

With Docker Compose we can use `docker compose run SERVICE COMMAND` to run a service with a specific command. Command `wget` requires the flag `-O` with `-` to output the response to the stdout:

    $ docker compose run debug-helper wget -O - http://app:3000

he URL is the interesting part here. We simply said to connect to the port 3000 of the service app. The _app_ is the name of the service specified in the `docker-compose.yml`. And the _port_ used is the port from which the application is available in that container.

## Communication between containers in a more ambitious environment

### reverse proxy

A reverse proxy is a type of proxy server that retrieves resources on behalf of a client from one or more servers. These resources are then returned to the client, appearing as if they originated from the reverse proxy server itself. (Wikipedia)

There are multiple different options for a reverse proxy implementation, such as Traefik, Caddy, Nginx, and Apache (ordered by initial release from newer to older). Our pick is _Nginx_.

## Tools for production

- Kubernetes

Other courses:

- DevOps with Docker (https://devopswithdocker.com/)
- DevOps with Kubernetes (https://devopswithkubernetes.com/)
