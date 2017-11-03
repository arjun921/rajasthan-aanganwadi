$( document ).ready(function() {
    // CONFIG
    var user_token="";
    var token_length = 100;
    var murmur_seed_value = 24;

    // function definitions for everything
    function cleanSlate(){ $("#mainContainer").html(''); 
    };


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
        console.log(config);
        var ident = formid + config["id"];
        var label = $("<label for='" + ident + "'>" + config["label"] + "</label>");
        var group = $("<div class='form-group'></div>");
        group.append(label);

        if(config['kind'] == "checkbox")
        {
            var n_checks = config["misc"].length;
            for(var i=0; i < n_checks; i++){
                var ck = config["misc"][i];
                var subid=ck["subID"];
                var sub_label = $("<br><label for='"+subid+"'>" + ck["subLabel"] + "</label>");
                var check = $("<input type='checkbox' id='"+subid+"'/>");
                group.append(sub_label);
                group.append(check);
            }//loop
        } // checkbox
        else if(config["kind"] == "radio") {
            var n_checks = config["misc"].length;
            for(var i=0; i < n_checks; i++){
                var ck = config["misc"][i];
                var subid=ck["subID"];
                var sub_label = $("<br><label for='"+subid+"'>" + ck["subLabel"] + "</label>");
                var check = $("<input name='"+ident+"' type='radio' id='"+subid+"'/>");
                group.append(sub_label);
                group.append(check);
            }//loop
        } 
        else if(config["kind"] == "select"){
            var n_checks = config["misc"].length;
            var selection = $("<br><select id='"+ident+"'></select>");
            for(var i=0; i < n_checks; i++){
                var ck = config["misc"][i];
                var subid=ck["subVal"];
                var check = $("<option value='"+subid+"'>"+ck["subLabel"]+"</option>");
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
            var part = $(string);
            group.append(part);

        }else {
            var string = "<input id='"+ident+"' ";
            string += "type='" + config["kind"] + "' ";
            string += "class='form-control' >"
            string += "</input>"
            var part = $(string);
            group.append(part);
        }

        group.append($("<hr>"));
        return group
    } // make a part of a form

    function deleteForm(){
        var formid = this.getAttribute("formid");
        hitApi("/form/delete", {"formid": formid}, function (d, s, x){
            $("#formtab").click();
            console.log(d);
        });
    }// delete form

    function newForm(){
        $("#form_control").html("");
        $("#form_display").html("");

    }  // new form

    function editForm(){
        var formid = this.getAttribute("formid");
    }

    function showForm(){
        $("#form_display").html("");
        var formid = this.id;
        hitApi("/form", {"formid": formid}, function (data, st, x){
            console.log(data);
            $("#form_display").append($("<h2>" + data["title"] + "</h2>"));
            $("#form_display").append($("<hr>"));
            // CONTROLS FOR THE FORM
            var delete_form = $("<button class='btn btn-danger' id='delete_"+formid+"' formid='"+formid+"'>Delete Form</button>");
            delete_form.click(deleteForm);
            var edit_form = $("<button class='btn btn-default' id='edit_"+formid+"'>Edit Form</button>");
            edit_form.click(editForm);
            $("#form_control").append(delete_form);
            $("#form_control").append(edit_form);

            var n_parts = data["fields"].length;
            for(var i=0; i<n_parts; i++){
                var part = makePart(data["fields"][i], formid);
                $("#form_display").append(part);
            }// for each part
        });
    } // form display


    function getFormList(){
        var form_listing = $("<div class='col-md-3' id='form_listing'></div>");
        var form_display = $("<div class='col-md-6' id='form_display'></div>");
        var form_control = $("<div class='col-md-3' id='form_control'></div>");
        $("#mainContainer").append(form_listing);
        $("#mainContainer").append(form_display);
        $("#mainContainer").append(form_control);
        var new_form = $("<button class='btn btn-default' id='new_form'>New Form</button>");
        new_form.click(newForm);
        $("#form_control").append(new_form);

        hitApi("/form/list", {}, function (data, st, x){
            var n_forms = data["forms"].length;
            var listing = $("<ul id='form_list' class='list-group'></ul>");
            for(var i=0; i<n_forms; i++){
                var form = data["forms"][i];
                var li = $("<li class='list-group-item'></li>");
                var link = $("<a id='"+form["formid"]+"' href='#' class='form_item'>"+form["title"]+"</a>");
                li.append(link);
                listing.append(li);
                link.click(showForm);
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
