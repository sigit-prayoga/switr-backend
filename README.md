# switr-backend
SWITR - simpler than twitter -- Backend part using nodejs, express, mongoDb and socket.io

#### Run it in your local

Make sure you have npm and node installed in your machine

Navigate to the folder where you clone the project.

```sh
$ cd switr-backend
```

And then, you have to install all dependencies using npm

```sh
$ npm install
```

If you have MongoDB already in your computer. Run your mongoDb server

```sh
$ mongod
```

Default, your server will be running on /data/db, to check go to your terminal again and type: 

```sh
$ mongo

$ show dbs
```

Finally, run node to run the server

```sh
$ node server.js
```

### Todos
- Create Users collections with MongoDB