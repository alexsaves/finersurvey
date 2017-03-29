/**
 * Does the work of transmitting data
 * @param {*} guid 
 * @param {*} data 
 */
var Completer = function(guid, data) {
  this.guid = guid;
  this.data = data;
};

/**
 * Save the results to the server
 */
Completer.prototype.saveResults = function(callback) {
  $.post('/s/' + this.guid, this.data, function() {
      
  });
};
