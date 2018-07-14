const finercommon = require('finercommon');

/**
 * A Survey controller
 */
var SurveyController = function (cfg) {
    this.cfg = cfg;
};

/**
 * Load the opportunity info
 * @param {*} id
 * @param {*} cb
 */
SurveyController.prototype.loadOpportunityInfo = function (id, cb) {
    finercommon
        .models
        .CRMOpportunities
        .GetById(this.cfg, id, (err, opp) => {
            if (err) {
                cb(err);
            } else {
                finercommon.models.CRMOpportunityRoles.GetByOpportunityIdWithContacts(this.cfg, opp.id, (err, contacts) => {
                    if (err) {
                        cb(err);
                    } else {
                        opp.contacts = contacts.map((c) => {
                            return c.contact;
                        });
                        cb(null, opp);
                    }
                });
            }
        });
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
        .GetByGuid(this.cfg, guid, (err, srv) => {
            clearTimeout(timeouttimer);
            if (err) {
                requestEmitter.emit('error', err);
            } else {
                srv.survey_model = srv.survey_model;
                srv.survey_model.guid = guid;
                finercommon
                    .models
                    .Organization
                    .GetById(this.cfg, srv.organization_id, (err, org) => {
                        if (err) {
                            requestEmitter.emit('error', err);
                        } else {
                            srv._org = org;
                            this.loadOpportunityInfo(srv.opportunity_id, (err, opp) => {
                                if (err) {
                                    requestEmitter.emit('error', err);
                                } else {
                                    requestEmitter.emit('done', srv, org, opp);
                                }
                            });
                        }
                    });
            }
        });
};

/**
 * Get a respondent from a session
 * @param session {Session}
 * @param cb {Function} callback
 */
SurveyController.prototype.getRespondentFromSession = function (session, requestEmitter, sguid, ua, ip, approval, cb) {
    var respid = session.rid;
    if (!cb) {
        throw new Error("Missing callback!");
    }
    if (!respid) {
        finercommon
            .models
            .Respondent
            .Create(this.cfg, {
                prospect_id: 0,
                survey_guid: sguid,
                user_agent: ua,
                ip_addr: ip,
                time_zone: 99999,
                approval_guid: approval || ''
            }, function (err, resp) {
                if (err) {
                    requestEmitter.emit('error', err);
                } else {
                    cb(resp);
                }
            });
    } else {
        finercommon
            .models
            .Respondent
            .GetById(this.cfg, respid, (err, respondent) => {
                if (err) {
                    finercommon
                        .models
                        .Respondent
                        .Create(this.cfg, {
                            prospect_id: 0,
                            survey_guid: sguid,
                            user_agent: ua,
                            ip_addr: ip,
                            time_zone: 99999,
                            approval_guid: approval || ''
                        }, function (err, resp) {
                            if (err) {
                                requestEmitter.emit('error', err);
                            } else {
                                cb(resp);
                            }
                        });
                } else {
                    cb(respondent);
                }
            });
    }
};

/**
 * Save the survey data
 */
SurveyController.prototype.saveSurveyResults = function (guid, submitBody, resp, cb) {
    if (arguments.length < 4) {
        throw new Error("Missing argments in save survey results.");
    }
    // First get the survey object
    finercommon
        .models
        .Survey
        .GetByGuid(this.cfg, guid, (err, srv) => {
            if (err) {
                console.log("Could not get survey by guid", guid);
                requestEmitter.emit('error', err);
            } else {
                srv.survey_model = srv.survey_model;

                // Set the time zone if it hasn't already
                resp.setTimeZone(this.cfg, submitBody.tz, (err, resp) => {
                    if (err) {
                        cb(err);
                    } else {
                        resp.variables = submitBody.variables;
                        resp.answers = submitBody.answers;
                        resp.commit(this.cfg, (err) => {
                            if (err) {
                                cb(err);
                            } else {
                                // Now integrate the responses
                                srv.saveRespondent(this.cfg, resp, submitBody, (err, resp) => {
                                    if (err) {
                                        cb(err);
                                    } else {
                                        cb(null);
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