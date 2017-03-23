var finercommon = require('finercommon');

/**
 * A Survey controller
 */
var SurveyController = function(cfg) {
  this.cfg = cfg;
};

/**
 * Load survey by guid
 */
SurveyController.prototype.loadSurveyByGuid = function(guid, requestEmitter) {
  finercommon.models.Survey.GetByGuid(this.cfg, guid, function(err, srv) {
    if (err) {
      requestEmitter.emit('error', err);
    } else {
      srv.survey_model = JSON.parse(srv.survey_model.toString());
      requestEmitter.emit('done', srv);
    }
  });
};

/**
 * Export the controller
 */
module.exports = SurveyController;