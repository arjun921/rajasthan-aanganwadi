var link = 'https://rajasthan-aanganwadi.herokuapp.com';
var lastElem = "";
$(document).ready(function() {
  $('select').material_select();
  $("#text").hide();
  $("#radio").hide();
  $("#checkbox").hide();
  $("#dropdown").hide();
  $("#range").hide();
  $("#datepicker").hide();
  $("#timepicker").hide();
  for (var i = 0; i < create.fields.length; i++) {
    create_newElem(create.fields[i]);
  }
  //enables time picker
  $('.timepicker').pickatime({
    default: 'now', // Set default time: 'now', '1:30AM', '16:30'
    fromnow: 0, // set default time to * milliseconds from now (using with default = 'now')
    twelvehour: false, // Use AM/PM or 24-hour format
    donetext: 'OK', // text for done-button
    cleartext: 'Clear', // text for clear-button
    canceltext: 'Cancel', // Text for cancel-button
    autoclose: false, // automatic close timepicker
    ampmclickable: true, // make AM PM clickable
    aftershow: function() {} //Function for after opening timepicker
  });
  //enables datepicker
  $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15, // Creates a dropdown of 15 years to control year,
    today: 'Today',
    clear: 'Clear',
    close: 'Ok',
    closeOnSelect: false // Close upon selecting a date,
  });
  //enables nav
  $(".button-collapse").sideNav();
 $('select').material_select();
});
var i = 0;

function create_newElem(field){
  type= field.kind;
  var original = document.getElementById(type);
  var clone = original.cloneNode(true); // "deep" clone
  clone.id = type + ++i;
  // console.log(clone.id);
  if (type=='text') {
    clone.children[0].id = field.id;
    clone.children[0].type = field.kind;
    clone.children[1].for = clone.children[0].id;
    clone.children[1].innerHTML = field.label;
    original.parentNode.appendChild(clone);
    $("#"+clone.id).show();
  }
  else if (type=='checkbox') {
    // $('#'+clone.children[0].id).append(s);

    //cb question start
    // clone.children[0].innerHTML = field.label;
    clone.children[0].id = 'title'+field.id;
    original.parentNode.appendChild(clone);
    $("#"+clone.id).show();
    console.log(field.label);
    console.log(clone.children[0].id);
    s = "<p>"+field.label+"</p>"
    $('#'+clone.children[0].id).append(s);
    // console.log(clone.children[0].id );
    //cb question end
    for (var i = 0; i < field.misc.length; i++) {
      // console.log(field.misc[i].subLabel);
      s = "<p><input type=\"checkbox\" id=\""+field.misc[i].subID+"\"/><label for=\""+field.misc[i].subID+"\">"+field.misc[i].subLabel+"</label></p>";

      $('#'+clone.children[0].id).append(s);
    }
  }
  // else if (type=='radio') {
  //   $('#'+clone.children[0].id).append();
  // }
  else {
    original.parentNode.appendChild(clone);
    $("#"+clone.id).show();
  }
  // or clone.id = ""; if the divs don't need an ID


  // console.log(clone.id);

}
