const finercommon = require('finercommon');

/**
 * A Survey controller
 */
var SurveyController = function (cfg) {
    this.cfg = cfg;
};

/**
 * Load survey by guid
 */
SurveyController.prototype.loadSurveyByGuid = function (guid, requestEmitter) {
    var timeouttimer = setTimeout(function () {
        requestEmitter.emit('timeout');
    }, this.cfg.pageTimeout);
    finercommon
        .models
        .Survey
        .GetByGuid(this.cfg, guid, function (err, srv) {
            clearTimeout(timeouttimer);
            if (err) {
                requestEmitter.emit('error', err);
            } else {
                srv.survey_model = JSON.parse(srv.survey_model.toString());
                srv.survey_model.guid = guid;
                finercommon
                    .models
                    .Organization
                    .GetById(this.cfg, srv.organization_id, function (err, org) {
                        if (err) {
                            requestEmitter.emit('error', err);
                        } else {
                            srv._org = org;
                            requestEmitter.emit('done', srv);
                        }
                    }.bind(this));
            }
        }.bind(this));
};

/**
 * Get a respondent from a session
 * @param session {Session}
 * @param cb {Function} callback
 */
SurveyController.prototype.getRespondentFromSession = function (session, requestEmitter, sguid, ua, ip, cb) {
    var respid = session.rid;

    if (!respid) {
        finercommon
            .models
            .Respondent
            .Create(this.cfg, {
                prospect_id: 0,
                survey_guid: sguid,
                user_agent: ua,
                ip_addr: ip,
                time_zone: 99999
            }, function (err, resp) {
                if (err) {
                    requestEmitter.emit('error', err);
                } else {
                    cb(resp.id);
                }
            });
    } else {
        // Just return immediately
        process
            .nextTick(function () {
                cb(parseInt(respid));
            })
    }
};

/**
 * Save the survey data
 */
SurveyController.prototype.saveSurveyResults = function (guid, submitBody, rid, requestEmitter) {
    if (arguments.length < 4) {
        throw new Error("Missing argments in save survey results.");
    }

    // First get the survey object
    finercommon
        .models
        .Survey
        .GetByGuid(this.cfg, guid, (err, srv) => {
            if (err) {
                requestEmitter.emit('error', err);
            } else {
                srv.survey_model = JSON.parse(srv.survey_model.toString());

                // Get the respondent
                finercommon
                    .models
                    .Respondent
                    .GetById(this.cfg, rid, (err, resp) => {
                        if (err) {
                            requestEmitter.emit('error', err);
                        } else {
                            // Set the time zone if it hasn't already
                            resp.setTimeZone(this.cfg, submitBody.tz, (err, resp) => {
                                if (err) {
                                    requestEmitter.emit('error', err);
                                } else {
                                    // Now integrate the responses
                                    srv.saveRespondent(this.cfg, resp, submitBody, (err, resp) => {
                                        if (err) {
                                            requestEmitter.emit('error', err);
                                        } else {
                                            requestEmitter.emit('done', resp);
                                        }
                                    });
                                }
                            });
                        }
                    });
            }
        });
};

/**
 * Export the controller
 */
module.exports = SurveyController;