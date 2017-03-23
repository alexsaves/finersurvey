$(document).ready(function() {
  var srvNd = $("script[type=\"finer/survey\"]").first()[0],
  srvB64 = srvNd.innerText,
  srvJSONStr = atob(srvB64),
  srvMdl = JSON.parse(srvJSONStr);
  Survey.defaultBootstrapCss.navigationButton = "btn btn-primary";
  Survey.Survey.cssType = "bootstrap";
  var survey = new Survey.Model(srvMdl);
  var data = {name:"John Doe", email: "johndoe@nobody.com", car:["Ford"]};
  var surveyValueChanged = function (sender, options) {
    var el = document.getElementById(options.name);
    if(el) {
      el.value = options.value;
    }
  };
  
  
  $("#surveyElement").Survey({
    model: survey,
    data: data,
    onValueChanged: surveyValueChanged
  });
  
});