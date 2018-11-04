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

    cluster
        .on('exit', function (deadWorker, code, signal) {
            console.log('Worker %d died (%s). restarting...', deadWorker.process.pid, signal || code);

            // Restart the worker
            var worker = cluster.fork();

            // Log the event
            console.log(`worker ${worker.process.pid} died.`);
            console.log(`worker ${deadWorker.process.pid} born.`);
        });

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
        MySQLStore = require('express-mysql-session')(session),
        //FileStore = require('session-file-store')(session),
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
    app.use(bodyParser.urlencoded({ extended: true }));

    // Parse JSON
    app.use(bodyParser.json());

    // Set up the session handler
    /*pjson.config.session.store = new RedisStore({
  client: redisClient
});*/
    //pjson.config.session.store = new FileStore();
    const sessionOptions = {
        host: pjson.config.db.host,
        user: pjson.config.db.user,
        password: pjson.config.db.pw,
        port: parseInt(pjson.config.db.port),
        database: pjson.config.db.db
    };

    pjson.config.session.store = new MySQLStore(sessionOptions);
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

        if (!respObj.body || (typeof (respObj.body) != 'string' && !(respObj.body instanceof Buffer))) {
            respObj.body = ' ';
        }

        res.end(respObj.body);
    };

    /**
 * Root
 */
    app.get('/', (req, res) => {
        res.end(`<!doctype html>
        <html>
        <head><style>
        * {box-sizing: border-box;}
        html {
            --header-height: 60px;
            
        }
        
        html, body  {
            overscroll-behavior-y: contain;
            display:block;
            margin: 0;
        } 
        .bottomdiv {
            position: fixed;
            bottom: 0;
            color: black;
            text-align:center;
            height: 2em;
            width: 100%;
            z-index: 999999;}</style>
            <script>
            /*function _fixViewportHeight() {
                var html = document.querySelector('html');
            
                function _onResize(event) {
                    html.style.height = window.innerHeight + 'px';
                    document.body.style.height = window.innerHeight + 'px';
                }
            
                window.addEventListener('resize', _onResize);
            
                _onResize();
            }
            
            _fixViewportHeight();*/
            </script>
            <meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, target-densityDpi=device-dpi"><title>BlastTech Feedback</title></head>
        <body><div class="bottomdiv">Im at bottom br!</div></body>
        </html>`);
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

        if (req.query && (req.query.a || req.query.p)) {
            isNew = true;
            try {
                req.session.rid = null;
                if (req.query.a) {
                    existingAnswers = JSON.parse(req.query.a);
                    req.session.existingAnswers = existingAnswers;
                }
                if (req.query.p) {
                    req.session.approval = req.query.p;
                }

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
            var existingAnswers = {},
                approval;

            // First check to see if there is an answer state
            if (req.session && req.session.existingAnswers) {
                existingAnswers = JSON.parse(JSON.stringify(req.session.existingAnswers));
                delete req.session.existingAnswers;
            }

            // Then check to see if we have an approval
            if (req.session && req.session.approval) {
                approval = req.session.approval;
                delete req.session.approval;
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
            requestEmitter.on('done', function (srvObj, orgObj, oppObj) {
                let decisionMakers = "",
                    decisionMakerList = [];
                if (oppObj && oppObj.contacts && oppObj.contacts.length > 0) {
                    for (let v = 0; v < oppObj.contacts.length; v++) {
                        let contact = oppObj.contacts[v];
                        var contactInfo = {
                            Name: contact.Name,
                            Title: contact.Title,
                            Full: contact.Name + " (" + contact.Title + ")"
                        };
                        if (contact.Title == null || contact.Title.toString().toLowerCase() == "null") {
                            contactInfo.Full = contact.Name;
                            contactInfo.Title = "";
                        }
                        if (v > 0) {
                            decisionMakers += ", ";
                        }
                        decisionMakers += contactInfo.Name;
                        decisionMakerList.push(contactInfo);
                    }

                }
                // Get the respondent object
                sv
                    .getRespondentFromSession(req.session, requestEmitter, guid, usSrc, ip, approval, function (resp) {
                        // Get the opportunity object
                        models.CRMOpportunities.GetById(pjson.config, srvObj.opportunity_id, (err, crmopp) => {
                            models.CRMAccounts.GetById(pjson.config, crmopp.AccountId, (err, crmact) => {
                                // Set up the survey variables for this survey
                                let surveyVariables = {
                                    prospectName: crmact ? crmact.Name : crmopp.Name,
                                    surveyTitle: srvObj.name,
                                    companyName: srvObj._org.name,
                                    surveyTheme: orgObj.default_survey_template
                                };
                                if (decisionMakers && decisionMakers.length > 0) {
                                    surveyVariables.decisionMakerList = decisionMakers;
                                    for (let b = 0; b < decisionMakerList.length; b++) {
                                        surveyVariables["decisionMaker" + (b + 1)] = decisionMakerList[b].Full;
                                    }
                                }

                                // Add features
                                for (let b = 0; b < orgObj.feature_list.length; b++) {
                                    surveyVariables["feature" + (b + 1)] = orgObj.feature_list[b];
                                }

                                // Add competitors
                                for (let b = 0; b < orgObj.competitor_list.length; b++) {
                                    surveyVariables["competitor" + (b + 1)] = orgObj.competitor_list[b];
                                }

                                // Save the variables to the respondent
                                resp.variables = surveyVariables;
                                resp.commit(pjson.config);

                                req.session.rid = resp.id;
                                req
                                    .session
                                    .save(() => {
                                        _outputResponse(res, templs.renderWithBase('surveybase', 'standardsurvey', {
                                            title: srvObj.name,
                                            pageUrl: req.protocol + '://' + req.get('host') + '/s/' + guid,
                                            surveyDescription: "Help " + srvObj._org.name + " by giving your feedback on your recent interactions.",
                                            surveyImage: req.protocol + '://' + req.get('host') + "/static/assets/logos/finerink.svg",
                                            respondent: resp.id,
                                            session: req.session,
                                            model: srvObj.survey_model,
                                            surveyID: guid,
                                            theme: orgObj.default_survey_template,
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
                                                    winLossAnalysis: "Sales Win/Loss Analysis",
                                                    otherDefaultValue: "Other"
                                                },
                                                metadata: {
                                                    title: srvObj.name,
                                                    guid: srvObj.survey_model.guid,
                                                    theme: orgObj.default_survey_template,
                                                    updated_at: srvObj.updated_at
                                                },
                                                currentPage: Math.min(pg, srvObj.survey_model.pages.length),
                                                pages: srvObj.survey_model.pages,
                                                answers: existingAnswers || {},
                                                variables: surveyVariables,
                                                saveUrl: '/s/' + encodeURIComponent(guid)
                                            }))
                                        }));
                                    });
                            });
                        });

                    });
            });

            // Load the survey and all associated information
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
                body: JSON.stringify({ success: true, respondent: respondent.id }),
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
                body: JSON.stringify({ error: "There was an error saving the data.", respondent: req.body.respondent }),
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        });

        // Get a respondent and save the results
        sv.getRespondentFromSession(req.session, requestEmitter, guid, usSrc, ip, '', function (respondent) {
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