// All HTML Strings go here.
// Created for simplifying and better code readability
function getHTMLTxtField(field) {
  return "<div class=\"input-field col s6\"><input id=" + field.id + " type=\"text\" " + "><label for=" + field.id + ">" + field.label + "</label></div>"
}

function getHTMLLabel(field) {
  return "<p>" + field.label + "</p>"
}

function getHTMLRadioButtons(field,va) {
  return "<p>  <input name=" + field.id + " type=\"radio\" id=" + va.subID + " value=" + va.subID + " />  <label for=" + va.subID + ">" + va.subLabel + "</label></p>"
}

function getHTMLCheckBoxes(cbv) {
  return "<p><input type=\"checkbox\" id=" + cbv.subID + " /><label for=" + cbv.subID + ">" + cbv.subLabel + "</label></p>"
}

function getHTMLSelect(field) {
  return "<select id=" + field.id + "><option value=\"\" disabled selected>Choose your option</option></select>"
}

function getHTMLSelectFields(vs) {
  return "<option value=" + vs.subVal + ">" + vs.subLabel + "</option>"
}

function getHTMLRange(field) {
  return "<p class=\"range-field\"><input type=\"range\" id=" + field.id + " min=" + field.misc[0].min + " max=" + field.misc[0].max + " /></p>"
}

function getHTMLDatePicker(field) {
  return "<input type=\"text\" class=\"datepicker\" id=" + field.id + " placeholder=\"Choose Date\">"
}

function getHTMLTimePicker(field) {
  return "<input type=\"text\" class=\"timepicker\" id=" + field.id + " placeholder=\"Select Time\">"
}

function getHTMLNoFormsToFill() {
  return "<a class=\"collection-item\" href=\"index.html\">No Forms to fill at the moment</a>"
}

function getHTMLFormSubmitButton() {
  return "<button style=\"padding-bottom:20px;\" class=\"btn waves-effect waves-light\"onclick=\"doSubmit()\">Submit<i class=\"material-icons right\">send</i></button>"
}

function getHTMLFormTitle(fields_returned) {
  return "<h5>" + fields_returned.title + "</h5>"
}

function getHTMLVideoPlayer(data) {
  return "<video class=\"responsive-video\" style=\"width:100%; padding-top: 25px;\" controls controlsList=\"nodownload\"><source src=" + server + data.url + " type=\"video/mp4\"></video>"
}

function getHTMLAudioPlayer(data) {
  return "<p></p><audio  controlsList=\"nodownload\" controls=\"controls\" style=\"width:100%; padding-top: 25px;\" id = \"player\"><source src = " + server + data.url + " /></audio>"
}

function getHTMLPDFViewer(flink) {
  return "<iframe onload=\"$('#closeIcon').addClass('black-text');$('#CloseTablet').removeClass('tabletClose');$('#CloseTablet').addClass('tabletClosePdf');$('#preloader').hide();\" src=\""+flink+"\" class=\"z-depth-4\" id=\"docIframe\" style=\"position:absolute; top:0px; left:0px; bottom:0px; z-index: 2; right:0px; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden;\">Your browser doesn't support iframes</iframe>"
}

function getHTMLFormsListElement(item) {
  strBegin = "<div id=\""+item.formid+"\"  onclick=\"load_form(this.id)\" class=\"col s12 m6 l6\"><div style=\"width: 100%\" class=\"waves-effect waves-yellow card-panel \"><div style=\"margin: 0px; padding: 0px;\" class=\"row\"><h5><i class=\"right material-icons\">"
  strEnd = "</i></h5><h5 class=\"left-align\">"+item.title+"</h5></div></div></div>"
  p = strBegin+strEnd
  // return "<a class=\"collection-item\" onclick=\"load_form(this.id)\" id=\""+item.formid+"\">"+item.title+"</a>";
  return p
}

function getHTMLcategoryFileCardElement(item){
  fileType = getFileType(item);
  strBegin = "<div id=\""+item.id+"\"  onclick=\"navClick(this.id)\" class=\"col s6 m6 l6\"><div style=\"width: 100%\" class=\"waves-effect waves-yellow card-panel \"><div style=\"margin: 0px; padding: 0px;\" class=\"row\"><p><i class=\"right material-icons\">"
  icon = getIcon(fileType);
  strEnd = "</i></p><p class=\"left-align\">"+item.title+"</p></div></div></div>"
  p = strBegin+icon+strEnd
  return p
}

function getHTMLCategoryUp(){
  // strBegin = " <li class=\"collection-item deep-purple-text\" onclick=\"window.history.go(-1);\"><div>Go Up...<div class=\"secondary-content center\" >"
  // icon = "<i class=\"material-icons\">chevron_left"
  // strEnd = "</i></div></li>"
  strBegin = "<div  onclick=\"window.history.go(-1);\" class=\" col s12 m12 l12\"><div style=\"width: 100%\" class=\"waves-effect waves-yellow card-panel \"><div style=\"margin: 0px; padding: 0px;\"  class=\"row\"><p><i class=\"right material-icons\">"
  icon = "chevron_left"
  strEnd = "</i></p><p class=\"left-align\">Go Up...</p></div></div></div>"
  p = strBegin+icon+strEnd
  return p
}
