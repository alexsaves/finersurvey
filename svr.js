/**
 * Global dependencies.
 */
var mysql = require('mysql'),
    express = require('express'),
    cluster = require('cluster'),
    pjson = require('./app/utils/environ'),
    timeout = require('connect-timeout'),
    extend = require('extend'),
    useragent = require('express-useragent'),
    AWS = require('aws-sdk'),
    encoding = require("encoding"),
    redis = require('redis'),
    templates = require('./app/utils/templates'),
    finercommon = require('finercommon'),
    events = require('events'),
    port = process.env.PORT || 8080,
    btoa = require('btoa'),
    path = require('path');

// Set the time zone
process.env.TZ = pjson.config.aws.timeZone;

// SET THE REGION
AWS.config.region = pjson.config.aws.region;

// SET ACCESS KEYS AWS.config.accessKeyId = pjson.config.aws.accessKeyId;
// AWS.config.secretAccessKey = pjson.config.aws.secretAccessKey; Code to run if
// we're in the master process
if (cluster.isMaster && process.env.NODE_ENV == 'production') {
    // Count the machine's CPUs
    var cpuCount = require('os')
        .cpus()
        .length;

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
            "App-Server-Version": pjson
                .version
                .toString(),
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
        app.use(enforce.HTTPS({trustProtoHeader: true}));
    }

    /**
     * Run the server on the right port (look for the AWS environment variable)
     */
    app.set('port', port);

    // Trust the first proxy
    app.set('trust proxy', 1);

    // Force SSL on prod
    if (process.env.NODE_ENV == 'production') {
        console.log("Enforcing SSL...");
        app.use((req, res, next) => {
            if (req.headers['x-forwarded-proto'] === 'https') 
                return next();
            return res.redirect(301, 'https://' + path.join(req.hostname, req.url));
        });
    } else {
        console.log("Allowing non SSL...");
    }

    // Add body parser url parser
    app.use(bodyParser.urlencoded({extended: true}));

    // Parse JSON
    app.use(bodyParser.json());

    // Set up the session handler
    /*pjson.config.session.store = new RedisStore({
      client: redisClient
    });*/
    pjson.config.session.store = new FileStore();
    app.use(session(pjson.config.session));

    /**
     * Favicon request
     */
    app.use('/favicon.ico', express.static('./dist/assets/favicon/favicon.ico'));

    /**
     * Static
     */
    app.use('/static', express.static('dist'));

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
    app.get([
        '/s/:surveyGuid/:pg', '/s/:surveyGuid'
    ], (req, res, next) => {
        var guid = req.params.surveyGuid,
            pg = parseInt(req.params.pg),
            sv = new SurveyController(pjson.config),
            usSrc = req.headers['user-agent'],
            ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            existingAnswers = null,
            isNew = true;

        if (req.session.rid) {
            isNew = false;
        }

        if (isNaN(pg) || pg < 0) {
            pg = 0;
        } else {
            pg--;
        }

        if (req.query && req.query.a) {
            isNew = true;
            try {
                existingAnswers = JSON.parse(req.query.a);
                req.session.existingAnswers = existingAnswers;
                req
                    .session
                    .save(() => {
                        res.redirect("/s/" + encodeURIComponent(guid) + "/" + ((pg || 0) + 1));
                    });
            } catch (e) {
                console.log("Could not deserialize answers!", e);
                res.redirect("/s/" + encodeURIComponent(guid) + "/" + ((pg || 0) + 1));
            }
        } else {
            // Holds any existing answers
            var existingAnswers = {};

            // First check to see if there is an answer state
            if (req.session && req.session.existingAnswers) {
                existingAnswers = JSON.parse(JSON.stringify(req.session.existingAnswers));
                delete req.session.existingAnswers;
            }

            var requestEmitter = new events.EventEmitter();
            requestEmitter.setMaxListeners(1);

            requestEmitter.on('error', function () {
                requestEmitter.removeAllListeners();
                _outputResponse(res, templs.renderWithBase('surveybase', 'errormessage', {
                    title: "Oops, there's a problem.",
                    details: "We're having difficulties right now, please try again a little later!",
                    session: req.session
                }, 500));
            });

            requestEmitter.on('timeout', function () {
                requestEmitter.removeAllListeners();
                _outputResponse(res, templs.renderWithBase('surveybase', 'errormessage', {
                    title: "Oops, there's a problem.",
                    details: "We're having difficulties right now, please try again a little later!",
                    session: req.session
                }, 500));
            });

            // Handle the done value
            requestEmitter.on('done', function (srvObj) {
                // Get the respondent object
                sv
                    .getRespondentFromSession(req.session, requestEmitter, guid, usSrc, ip, function (resp) {
                        req.session.rid = resp.id;
                        req
                            .session
                            .save(() => {
                                //console.log("is new?", isNew);
                                _outputResponse(res, templs.renderWithBase('surveybase', 'standardsurvey', {
                                    title: srvObj.name,
                                    respondent: resp.id,
                                    session: req.session,
                                    model: srvObj.survey_model,
                                    surveyID: guid,
                                    theme: srvObj.theme,
                                    modelstr: btoa(JSON.stringify({
                                        respondent: resp.id,
                                        isNew: isNew,
                                        messages: {
                                            prevPage: "Previous page",
                                            nextPage: "Next page",
                                            reqQuestion: "This question is required.",
                                            pageNotFound: "That page was not found.",
                                            startOver: "Don't worry. We'll return you to the beginning of the survey.",
                                            ok: "OK",
                                            requiredQ: "This question is required",
                                            winLossAnalysis: "Sales Win/Loss Analysis"
                                        },
                                        metadata: {
                                            title: srvObj.name,
                                            guid: srvObj.survey_model.guid,
                                            theme: srvObj.theme,
                                            updated_at: srvObj.updated_at
                                        },
                                        currentPage: Math.min(pg, srvObj.survey_model.pages.length),
                                        pages: srvObj.survey_model.pages,
                                        answers: existingAnswers || {},
                                        variables: {
                                            surveyTitle: srvObj.name,
                                            companyName: srvObj._org.name,
                                            surveyTheme: srvObj.theme
                                        },
                                        saveUrl: '/s/' + encodeURIComponent(guid)
                                    }))
                                }));
                            });
                    });
            });

            sv.loadSurveyByGuid(guid, requestEmitter);
        }
    });

    /**
     * Survey Results Save
     */
    app.post('/s/:surveyGuid', (req, res, next) => {
        var guid = req.params.surveyGuid,
            sv = new SurveyController(pjson.config),
            rid = req.body.respondent,
            usSrc = req.headers['user-agent'],
            ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // Re-assign the session id
        req.session.rid = req.body.respondent;

        var requestEmitter = new events.EventEmitter();
        requestEmitter.setMaxListeners(1);

        // Handles successful completion
        requestEmitter.on('done', function (respondent) {
            _outputResponse(res, {
                body: JSON.stringify({success: true, respondent: respondent.id}),
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        });

        // Handles an error state
        requestEmitter.on('error', function () {
            requestEmitter.removeAllListeners();
            _outputResponse(res, {
                body: JSON.stringify({error: "There was an error saving the data.", respondent: req.body.respondent}),
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        });

        // Get a respondent and save the results
        sv.getRespondentFromSession(req.session, requestEmitter, guid, usSrc, ip, function (respondent) {
            req.session.rid = req.body.respondent = respondent.id;

            // Save the reults now
            sv.saveSurveyResults(guid, req.body, respondent, function (err) {
                if (err) {
                    requestEmitter.emit("error");
                } else {
                    requestEmitter.emit("done", respondent);
                }
            });
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