$(document).ready(function () {
  var srvNd = $("script[type=\"finer/survey\"]").first()[0],
    srvB64 = srvNd.innerText,
    srvJSONStr = atob(srvB64),
    srvMdl = JSON.parse(srvJSONStr),
    surveyNode = $("#surveyElement");
  Survey.defaultBootstrapCss.navigationButton = "btn btn-primary";
  Survey.Survey.cssType = "bootstrap";  
  srvMdl.completedHtml = "<div class=\"completion\"></div>";
console.log(srvMdl);
  var survey = new Survey.Model(srvMdl);
  survey.showProgressBar = "top";
  survey.showQuestionNumbers = false;

  var data = { name: "John Doe", email: "johndoe@nobody.com", car: ["Ford"] };
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
    "onComplete": function(srv) {
      var dta = srv.data;
      var cmp = new Completer(srvMdl.guid, dta);
      cmp.saveResults();
    }
  });

});