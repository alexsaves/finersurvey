// Controls dynamic behaviors in the survey

var HandleQuestionUpdate = function (surveyNode) {
  $.each(surveyNode.find("input[type=checkbox], input[type=radio]"), function (index, value) {
    value = $(value);
    var qtype = value.attr("type"),
      isChecked = value[0].checked;
      
    if (isChecked) {
      value.parents("label").first().addClass("checked active");
      value.parents("div." + qtype).first().addClass("checked");
    } else {
      value.parents("label").first().removeClass("checked active");
      value.parents("div." + qtype).first().removeClass("checked");
    }
  });
};