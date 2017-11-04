$( document ).ready(function() {
    // CONFIG
    var user_token="";
    var token_length = 100;
    var murmur_seed_value = 24;
    var form_data = {};

    // function definitions for everything
    function cleanSlate(){ $("#mainContainer").html('');};


    function genToken() {
          var text = "";
          var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
          for (var i = 0; i < token_length; i++) {
                  text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
          return text;
    } // genToken

    function hitApi(endpoint, json, success_fn, auth=true){
        if(auth){
            json["token"] = user_token;
        };
        console.log("Hitting " + endpoint + " " + JSON.stringify(json));
        $.ajax({url: endpoint, type: 'post',
                contentType: 'application/json',
                data: JSON.stringify(json),
                success: success_fn});
    } // hit API

    function makeTag(name, contains="", config={}){
        var tag = $("<" + name + ">"+contains+"</" + name+">");
        for (var property in config) {
            if (config.hasOwnProperty(property)) {
                tag.attr(property, config[property]);
            } // if property is own
        } // loop
        return tag;
    } // make Tag

    // ------------------------------------------------
    // ------------------------------------------------

    function murmur(key, seed) {
          var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;
          remainder = key.length & 3; // key.length % 4
          bytes = key.length - remainder;
          h1 = seed;
          c1 = 0xcc9e2d51;
          c2 = 0x1b873593;
          i = 0;
          while (i < bytes) {
                  k1 =
                        ((key.charCodeAt(i) & 0xff)) |
                        ((key.charCodeAt(++i) & 0xff) << 8) |
                        ((key.charCodeAt(++i) & 0xff) << 16) |
                        ((key.charCodeAt(++i) & 0xff) << 24);
                  ++i;
                  k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
                  k1 = (k1 << 15) | (k1 >>> 17);
                  k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;
                  h1 ^= k1;
                  h1 = (h1 << 13) | (h1 >>> 19);
                  h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
                  h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
                }
          k1 = 0;
          switch (remainder) {
                      case 3:
                        k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
                      case 2:
                        k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
                      case 1:
                        k1 ^= (key.charCodeAt(i) & 0xff);
                        k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
                        k1 = (k1 << 15) | (k1 >>> 17);
                        k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
                        h1 ^= k1;
                    }
          h1 ^= key.length;
          h1 ^= h1 >>> 16;
          h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
          h1 ^= h1 >>> 13;
          h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
          h1 ^= h1 >>> 16;
          return h1 >>> 0;
    }   // MURMUR3 hash function


    function makePart(config, formid){
        var ident = formid + config["id"];
        var label = makeTag("label", config["label"], {"for": ident});
        var group = makeTag("div", "", {"class": "form-group"});
        group.append(label);

        if(config['kind'] == "checkbox")
        {
            var n_checks = config["misc"].length;
            for(var i=0; i < n_checks; i++){
                var ck = config["misc"][i];
                var subid=ck["subID"];
                var sub_label = makeTag("label", ck["subLabel"], {"for": subid});
                var check = makeTag("input", "", {"type": "checkbox", "id": subid});
                group.append(makeTag("br"));
                group.append(sub_label);
                group.append(check);
            }//loop
        } // checkbox
        else if(config["kind"] == "radio") {
            var n_checks = config["misc"].length;
            for(var i=0; i < n_checks; i++){
                var ck = config["misc"][i];
                var subid=ck["subID"];
                var sub_label = makeTag("label", ck["subLabel"], {"for": subid});
                var check = makeTag("input", "", {"type": "radio",
                                                  "id": subid,
                                                  "name": ident});
                group.append(makeTag("br"));
                group.append(sub_label);
                group.append(check);
            }//loop
        } 
        else if(config["kind"] == "select"){
            var n_checks = config["misc"].length;
            var selection = makeTag("select", "", {"id": ident});
            for(var i=0; i < n_checks; i++){
                var ck = config["misc"][i];
                var subid=ck["subVal"];
                var check = makeTag("option", ck["subLabel"], {"value": subid});
                group.append(makeTag("br"));
                selection.append(sub_label);
                selection.append(check);
            }//loop
            group.append(selection);
        }else if(config["kind"] == "range"){
            var M = config["misc"][0]["max"];
            var m = config["misc"][0]["min"];
            var string = "<input id='"+ident+"' ";
            string += "type='" + config["kind"] + "' ";
            string += "class='form-control' max='"+M+"' min='"+m+"'>"
            string += "</input>"
            var part = makeTag("input", "", {"id": ident,
                                             "type": config["kind"],
                                             "class": "form-control",
                                             "max": M, "min": m});
            group.append(part);

        }else {
            var string = "<input id='"+ident+"' ";
            string += "type='" + config["kind"] + "' ";
            string += "class='form-control' >"
            string += "</input>"
            var part = $(string);
            var part = makeTag("input", "", {"id": ident,
                                             "type": config["kind"],
                                             "class": "form-control",
                                            });
            group.append(part);
        }

        group.append(makeTag("hr"));
        return group
    } // make a part of a form

    function deleteForm(){ // DONE
        var formid = this.getAttribute("formid");
        hitApi("/form/delete", {"formid": formid}, function (d, s, x){
            $("#formtab").click();
            console.log(d);
        });
    }// delete form

    function addNewFormButton(){
        var new_form = makeTag("li", "", {"class": "list-group-item", "id": "new_form"});
        new_form.append(makeTag("a", "New Form", {"href": "#"}));
        new_form.click(newForm);
        $("#form_control").append(new_form);
        $("#form_control").append(makeTag("hr", "", {"class": "nav-divider"}));
    } // new form button

    function addDeleteFormButton(formid){
        var delete_form = makeTag("li", "", {"class": "list-group-item bg-warning", "id": "delete_"+formid, "formid": formid});
        delete_form.append(makeTag("a", "Delete Form", {"href": "#"}));
        delete_form.click(deleteForm);
        $("#form_control").append(delete_form);
    } // delete form button

    function addEditFormButton(formid){
        var edit_form = makeTag("li", "", {"class": "list-group-item", "id": "edit_"+formid, "formid": formid});
        edit_form.append(makeTag("a", "Edit Form", {"href": "#"}));
        edit_form.click(editForm);
        $("#form_control").append(edit_form);
    } // edit form button


    function addFormElementAdditionForms(){  // TODO
    } // form element addtion forms


    function newForm(){
        $("#form_control").html("");
        $("#form_display").html("");
        // add forms
        form_data = {"formid": "blank_form", "title": "",
                     "fields": []};
        showForm(form_data)
        editForm(form_data);
    }  // new form

    function editForm(data){
    } // edit form

    function editForm(){  // TODO
        var formid = this.getAttribute("formid");
    }


    function showForm(data){ // DONE
        var formid = data["formid"];
        $("#form_display").html("");
        $("#form_display").append(makeTag("h2", data["title"]));
        $("#form_display").append(makeTag("hr"));
        // CONTROLS FOR THE FORM
        addNewFormButton();
        addEditFormButton(formid);
        addDeleteFormButton(formid);

        var n_parts = data["fields"].length;
        for(var i=0; i < n_parts; i++){
            var part = makePart(data["fields"][i], formid);
            $("#form_display").append(part);
        }// for each part
    } // form display


    function getFormList(){
        var form_listing = makeTag("div", "", {"class": "col-md-3", "id": "form_listing"});
        var form_display = makeTag("div", "", {"class": "col-md-6", "id": "form_display"});
        var fcd = makeTag("div", "", {"class": "col-md-3", "id": "form_control_div"});
        var form_control = makeTag("ul", "", {"id": "form_control"});
        fcd.append(form_control);
        $("#mainContainer").append(form_listing);
        $("#mainContainer").append(form_display);
        $("#mainContainer").append(fcd);
        addNewFormButton();

        hitApi("/form/list", {}, function (data, st, x){
            var n_forms = data["forms"].length;
            var listing = makeTag("ul", "", {"class": "list-group", "id": "form_list"});
            for(var i=0; i<n_forms; i++){
                var form = data["forms"][i];
                var link = makeTag("li", "", {"class": "list-group-item", "id": form["formid"]});
                link.append(makeTag("a", form["title"], {"href": "#"}));
                listing.append(link);
                link.click(function (){
                    $("#form_control").html("");
                    var formid = this.id;
                    hitApi("/form", {"formid": formid}, function (data, st, x){
                        showForm(data);
                    });
                }); // form link click
            }//for loop
            form_listing.append(listing);
        });
    }; // form listing


    // ========================================= BINDINGS
    $("#formtab").click(function (){
        cleanSlate();
        getFormList();
    }); // form tab

    $("#contenttab").click(function (){
    }); // content tab

    $("#login_button").click(function (){
        var email = $("#login_email").val();
        var pwd = murmur($("#login_pwd").val(),
                           murmur_seed_value).toString();
        user_token = genToken();
        var json = {"email": email, "pwd": pwd};
        hitApi("/user/login", json, function (data, st,xhr){
            $("#login_div").hide();
            $("#logout_button").show();
        });
    }); // login click

    $("#logout_button").click(function (){
        hitApi("/user/logout", {}, function (data, st,xhr){
            $("#login_div").show();
            $("#logout_button").hide();
            user_token = "";
        });
    }); // logout click

    // ========================================= CALLS
    cleanSlate();
    // TODO: remove this
    $("#login_pwd").val("hash");
    $("#login_email").val("arjoonn.94@gmail.com");
    $("#login_button").click();
    $("#formtab").click();

}); // DOCUMENT READY
