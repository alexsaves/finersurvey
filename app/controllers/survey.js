var finercommon = require('finercommon');

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
  var timeouttimer = setTimeout(function() {
      requestEmitter.emit('timeout');
  }, this.cfg.pageTimeout);
  finercommon.models.Survey.GetByGuid(this.cfg, guid, function (err, srv) {
    clearTimeout(timeouttimer);
    if (err) {
      requestEmitter.emit('error', err);
    } else {
      srv.survey_model = JSON.parse(srv.survey_model.toString());
      srv.survey_model.guid = guid;
      requestEmitter.emit('done', srv);
    }
  });
};

/**
 * Save the survey data
 */
SurveyController.prototype.saveSurveyResults = function (guid, submitBody, requestEmitter) {
  finercommon.models.Survey.GetByGuid(this.cfg, guid, function (err, srv) {
    if (err) {
      requestEmitter.emit('error', err);
    } else {
      srv.survey_model = JSON.parse(srv.survey_model.toString());
      srv.saveRespondent(this.cfg, submitBody, function (err, resp) {
        if (err) {
          requestEmitter.emit('error', err);
        } else {
          console.log("DONE SAVING", resp);
          requestEmitter.emit('done', resp);
        }
      });
    }
  });
};

/**
 * Export the controller
 */
module.exports = SurveyController;