
$("#colorTitle").click(function(){
  $("#wrongColor").toggle();
  $("#colorTitle").toggleClass("section_selected");
});

$("#fontTitle").click(function(){
  $("#font_result").toggle();
  $("#fontTitle").toggleClass("section_selected");
});

$("#altTextTitle").click(function(){
  $("#altText_result").toggle();
  $("#altTextTitle").toggleClass("section_selected");
});