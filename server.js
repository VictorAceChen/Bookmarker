var http = require('http'),
  path = require('path'),

  express = require('express'),
  app = express(),

  favicon = require('serve-favicon'),

  sqlite3 = require('sqlite3').verbose(),
  db = new sqlite3.Database('db');

// configurations
app.configure(function() {
  // read jade files to html
  app.engine('.html', require('jade').__express);

  // send sstatic files to client
  app.set('views', __dirname + '/public/views');
  app.use(express.static(path.join(__dirname, 'public')));

  // Allows express to get data from POST requests
  app.use(express.bodyParser());

  // set favicon
  app.use(favicon(__dirname + '/public/images/favicon.png'));
});

// setup server
var port = process.env.PORT || 3000;
var host = process.env.HOST || "127.0.0.1";

var server = http.createServer(app).listen(port, host, function() {
  console.log("Server listening to %s:%d within %s environment",
              host, port, app.get('env'));
});

//setup database
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='bookmarks'", function(err, row) {
  if(err !== null) {
    console.log(err);
  }
  else if(row === null) {
    db.run('CREATE TABLE "bookmarks" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "title" VARCHAR(255), url VARCHAR(255))', function(err) {
        if(err !== null) {
            console.log(err);
        }
        else {
            console.log("SQL Table 'bookmarks' initialized.");
        }
    });
  }
  else {
    console.log("SQL Table 'bookmarks' already initialized.");
  }
});

//CRUD
app.get('/', function(req, res) {

  db.all('SELECT * FROM bookmarks ORDER BY title', function(err, row) {
      if(err !== null) {
          res.send(500, "An error has occurred -- " + err);
      }
      else {
          res.render('index.jade', {bookmarks: row}, function(err, html) {
              res.send(200, html);
          });
      }
  });
});

app.post('/add', function(req, res) {
    title = req.body.title;
    url = req.body.url;
    sqlRequest = "INSERT INTO 'bookmarks' (title, url) VALUES('" + title + "', '" + url + "')";
    db.run(sqlRequest, function(err) {
      if(err !== null) {
          res.send(500, "An error has occurred -- " + err);
      }
      else {
          res.redirect("/?status=[" + title + "] successfully added.");
      }
    });
});

app.get('/delete/:id', function(req, res) {
  title = req.query.title;
  db.run("DELETE FROM bookmarks WHERE id='" + req.params.id + "'", function(err) {
      if(err !== null) {
          res.send(500, "An error has occurred -- " + err);
      }
      else {
          res.redirect("/?status=[" + title + "] successfully deleted.");
      }
  });
});
