const pug = require('pug');
const fs = require('fs');
const path = require('path');
const extend = require('extend');
const check = require('check-types');

/**
 * Templates loader
 * @constructor
 */
var Templates = function () {
  this._templates = {};
};

/**
 * Add and compile a template
 * @param fileName
 */
Templates.prototype.addTemplateFromFile = function (fileName) {
  var flContents = fs.readFileSync(fileName).toString('utf-8'),
    baseFile = path.basename(fileName),
    rootName = baseFile.substr(0, baseFile.indexOf('.')),
    ptemp = pug.compile(flContents);
  this._templates[rootName.toLowerCase()] = ptemp;
};

/**
 * Add all the templates from the folder
 * @param folder
 */
Templates.prototype.addAllFromFolder = function (folder) {
  fs.readdir(folder, function (err, files) {
    if (files) {
      for (var i = 0; i < files.length; i++) {
        this.addTemplateFromFile(folder + '/' + files[i]);
      }
    }
  }.bind(this));
};

/**
 * Render a template
 * @param templateName
 * @param data
 */
Templates.prototype.render = function (templateName, data) {
  data = data || {};
  if (!data.title) {
    data.title = "Untitled";
  } else {
    data.title = data.title;
  }
  return this._templates[templateName.toLowerCase()](data);
};

/**
 * Render a template
 * @param templateName
 * @param data
 */
Templates.prototype.renderWithBase = function () {
  var previous = "{$content}",
  data = {};
  if (check.object(arguments[arguments.length - 1])) {
    data = arguments[arguments.length - 1];
  }
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    if (check.string(arg)) {
      var sub = this.render(arg, data);
      previous = previous.replace(/\{\$content\}/i, sub);
    }
  }
  return {body: previous, headers: {}};
};


/**
 * Render a template
 * @param templateName
 * @param data
 */
Templates.prototype.renderError = function (res, session, err) {
  res.status(404);
  res.end(this.renderWithBase('error', {title: "Error - " + err.message, session: session, error: err}));
};

/**
 * Expose this
 * @type {Templates}
 */
module.exports = Templates;