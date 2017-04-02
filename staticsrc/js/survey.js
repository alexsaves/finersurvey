$(document).ready(function () {
  var srvNd = $("script[type=\"finer/survey\"]").first()[0];
  if (!srvNd) {
    return;
  }
  var srvB64 = srvNd.innerText,
    srvJSONStr = atob(srvB64),
    srvMdl = JSON.parse(srvJSONStr),
    surveyNode = $("#surveyElement");
  Survey.defaultBootstrapCss.navigationButton = "btn btn-primary";
  Survey.Survey.cssType = "bootstrap";  
  srvMdl.completedHtml = "<div class=\"completion\"></div>";
  srvMdl.questionTitleTemplate = "{title} {require}";
  srvMdl.questionNoTemplate = "{no}";

  var survey = new Survey.Model(srvMdl);
  survey.showProgressBar = "top";
  //survey.showQuestionNumbers = false;

  var data = {
    // Meta data goes here
  };
  var surveyValueChanged = function (sender, options) {
    var el = document.getElementById(options.name);
    if (el) {
      el.value = options.value;
    }
  };

  surveyNode.Survey({    
    "model": survey,
    "data": data,
    "css": cssOverrides,
    "onValueChanged": function() {
      HandleQuestionUpdate(surveyNode);
    },
    "onCurrentPageChanged": function(srv) {
      setTimeout(function() {
        HandleQuestionUpdate(surveyNode);
      }, 20);
      (new Completer(srvMdl.guid, srv.data)).saveResults();
    },
    "onComplete": function(srv) {
      (new Completer(srvMdl.guid, srv.data)).saveResults();
    }
  });

});