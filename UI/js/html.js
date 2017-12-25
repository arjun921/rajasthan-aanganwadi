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

function getHTMLFormsListElement(item) {
  return "<a class=\"collection-item\" onclick=\"load_form(this.id)\" id=\""+item.formid+"\">"+item.title+"</a>";
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
