/**
* Global dependencies.
* (NewRelic should be 1st in this list.)
*/
var mysql = require('mysql'),
express = require('express'),
cluster = require('cluster'),
pjson = require('./app/utils/environ'),
timeout = require('connect-timeout'),
extend = require('extend'),
AWS = require('aws-sdk'),
encoding = require("encoding"),
redis = require('redis'),
templates = require('./app/utils/templates'),
finercommon = require('finercommon'),
events = require('events'),
port = process.env.PORT || 3001,
btoa = require('btoa');

// Set the time zone
process.env.TZ = pjson.config.aws.timeZone;

// SET THE REGION
AWS.config.region = pjson.config.aws.region;

// SET ACCESS KEYS
//AWS.config.accessKeyId = pjson.config.aws.accessKeyId;
//AWS.config.secretAccessKey = pjson.config.aws.secretAccessKey;

// Code to run if we're in the master process
if (cluster.isMaster && process.env.NODE_ENV == 'production') {
  
  // Count the machine's CPUs
  var cpuCount = require('os').cpus().length;
  
  // Tell the world
  console.log((new Date).toString(), "Starting " + pjson.name + " " + pjson.version + " on " + cpuCount + " CPUs @ " + (new Date()).toString() + "..");
  
  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }
  
  // Code to run if we're in a worker process
} else {
  /**
  * Set up another DB cluster
  * @type {{connectionLimit: number, host: *, user: *, password: *}}
  */
  var dbCluster = {
    connectionLimit: 5,
    host: pjson.config.db.host,
    user: pjson.config.db.user,
    password: pjson.config.db.pw
  },
  basicHeaders = {
    "Access-Control-Allow-Origin": "*",
    "App-Server-Version": pjson.version.toString(),
    "Content-Type": "text/html; charset=UTF-8"
  },  
  app = express(),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  FileStore = require('session-file-store')(session),
  /*RedisStore = require('connect-redis')(session);
  redisClient = redis.createClient(pjson.config.cache),*/
  enforce = require('express-sslify'),
  templs = new templates(),  
  models = finercommon.models,
  SurveyController = require('./app/controllers/survey');
  
  // Add the templates
  templs.addAllFromFolder('./app/views');

  // Turn on AWS SSL when its needed
  if (pjson.config.db.ssl.toString().toLowerCase() == 'true') {
    dbCluster.ssl = "Amazon RDS";
  }
  
  // Set up the connection pool
  var connectionPool = mysql.createPool(dbCluster);
  pjson.config.pool = connectionPool;
  
  // Tell us whats going on
  console.log("Starting a server on ", port, " @ " + (new Date()).toString() + "...");
  
  /**
  * Set the powered by
  */
  app.disable('x-powered-by');
  
  // Production SSL enforcer **************************
  if (process.env.NODE_ENV == 'production') {
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
  }
  
  /**
  * Run the server on the right port (look for the AWS environment variable)
  */
  app.set('port', port);
  // Trust the first proxy
  app.set('trust proxy', 1);
  
  // Set the page loade timeout
  app.use(timeout(pjson.config.pageTimeout, {respond: false}));
  
  // Add body parser url parser
  app.use(bodyParser.urlencoded({extended: true}));
  
  // Set up the session handler
  /*pjson.config.session.store = new RedisStore({
    client: redisClient
  });*/
  pjson.config.session.store = new FileStore();
  app.use(session(pjson.config.session));
  
  /**
  * Favicon request
  */
  app.use('/favicon.ico', express.static('./static/assets/favicon/favicon.ico'));
  
  /**
  * Static
  */
  app.use('/static', express.static('static'));
  
  /**
  * Output a proper response
  */
  var _outputResponse = function (res, respObj) {
    var headers = extend({}, basicHeaders, respObj.headers || {});
    
    for (var hd in headers) {
      var hval = encoding.convert(headers[hd], "ASCII", "UTF-8").toString();
      hval = hval.replace(/\n/gi, '');
      if (hval.length < 50) {
        res.setHeader(hd, hval);
      }
    }
    res.status(respObj.status || 200);
    
    if (!respObj.body || (typeof(respObj.body) != 'string' && !(respObj.body instanceof Buffer))) {
      respObj.body = ' ';
    }
    
    res.end(respObj.body);
  };
  
  /**
  * Root
  */
  app.get('/', (req, res) => {
    res.end("nothing here");
  });
  
  /**
  * Survey Display
  */
  app.get('/s/:surveyGuid', (req, res, next) => {
    var guid = req.params.surveyGuid,
      sv = new SurveyController(pjson.config);
    
    var requestEmitter = new events.EventEmitter();
    requestEmitter.setMaxListeners(1);

    requestEmitter.on('done', function(srvObj) {
        _outputResponse(res, templs.renderWithBase('surveybase', 'standardsurvey', {title: srvObj.name, session: req.session, model: srvObj.survey_model, modelstr: btoa(JSON.stringify(srvObj.survey_model))}));
    });

    requestEmitter.on('error', function() {
        console.log("error!!", arguments);
    });

    sv.loadSurveyByGuid(guid, requestEmitter);
  });

  /**
  * Survey Results Save
  */
  app.post('/s/:surveyGuid', (req, res, next) => {
    var guid = req.params.surveyGuid,
      sv = new SurveyController(pjson.config);
    
    var requestEmitter = new events.EventEmitter();
    requestEmitter.setMaxListeners(1);

    requestEmitter.on('done', function(srvObj) {
      res.end("{}");
        //_outputResponse(res, templs.renderWithBase('surveybase', 'standardsurvey', {title: srvObj.name, session: req.session, model: srvObj.survey_model, modelstr: btoa(JSON.stringify(srvObj.survey_model))}));
    });

    requestEmitter.on('error', function() {
        console.log("error!!", arguments);
    });

    sv.saveSurveyResults(guid, req.body, requestEmitter);
  });
  
  /**
  * Cross domain xml for flash
  */
  app.get('/crossdomain.xml', function (req, res) {
    _outputResponse(res, {
      headers: {
        "Content-Type": "text/x-cross-domain-policy"
      },
      body: "<?xml version=\"1.0\"?>\n<!DOCTYPE cross-domain-policy SYSTEM \"http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd\">\n<cross-domain-policy>\n<allow-access-from domain=\"*\" secure=\"false\"/>\n</cross-domain-policy>"
    });    
  });
  
  /**
  * Start up the server
  */
  app.listen(app.get('port'));
}

// If this is def then export it
if (process.env.NODE_ENV != 'production') {
  module.exports = app;
}