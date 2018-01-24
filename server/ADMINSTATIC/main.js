//These globals are needed
// CONFIG
var user_token="";
var token_length = 100;
var murmur_seed_value = 24;
var form_data = {};
var category_trail = [];
var report_bins = 10;


$( document ).ready(function() {

    // function definitions for everything
    function cleanSlate(){ $("#mainContainer").html('');};
    function getCurrentToken(){return user_token;};

	function showReports(data, selector, title){
        var row = makeTag('tr');
        var total = 0;
        for(var i = 0; i<data.length; i++) total += data[i];
        var mean = total / data.length;
        var variance = [];
        for(var i=0; i<data.length; i++) variance.push(Math.pow(data[i] - mean, 2));
        var total_var = 0;
        for(var i = 0; i<data.length; i++) total_var += variance[i];
        var std = Math.sqrt(total_var / data.length);
        // ------------
        row.append(makeTag("td", title));
        row.append(makeTag("td", mean));
        row.append(makeTag("td", std));
        $("#"+selector).append(row);
    }


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

    function makeTag(name, contains="", config={}, tags=''){
        var tag = $("<" + name + " " + tags +">"+contains+"</" + name+">");
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


    // ============================================= FORMS


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

    function addEditFormButton(formid, data){
        var edit_form = makeTag("li", "", {"class": "list-group-item", "id": "edit_"+formid, "formid": formid});
        edit_form.append(makeTag("a", "Save/Edit Form", {"href": "#"}));
        edit_form.click(function (){
            form_data = data;
            console.log(data);
            hitApi("/form/delete", {"formid": formid}, function(d, s, x){console.log(d);});
            hitApi("/form/create", form_data, function(d, s, x){console.log(d);});
            $("#formtab").click();
        });
        $("#form_control").append(edit_form);
    } // edit form button


    function formRangeAddForm(){
        var item = makeTag("li", "", {"class": "list-group-item input-group"});
        var button = makeTag("div", "", {"class": "input-group-btn"});
        var add = makeTag("button", "+", {"class": "btn btn-success"});
        // ----------------
        var m = makeTag("input", "", {"class": "form-control", "placeholder": "min"});
        var M = makeTag("input", "", {"class": "form-control", "placeholder": "Max"});
        var inp = makeTag("input", "", {"class": "form-control", "placeholder": "Question Here"});
        add.click(function (){
            form_data["fields"].push({"kind": "range", "label": inp.val(), "id": genToken(),
                                      "misc": [{"min": m.val(), "max": M.val()}]});
            showForm(form_data);
        });
        button.append(add);
        item.append(button);
        item.append(inp);
        item.append(m);
        item.append(M);
        return item
    }  // form part text

    function formTextAddForm(){
        var item = makeTag("li", "", {"class": "list-group-item input-group"});
        var inp = makeTag("input", "", {"class": "form-control", "placeholder": "Text input"});
        var button = makeTag("div", "", {"class": "input-group-btn"});
        var add = makeTag("button", "+", {"class": "btn btn-success"});
        add.click(function (){
            form_data["fields"].push({"kind": "text", "label": inp.val(), "id": genToken()});
            showForm(form_data);
        });
        button.append(add);
        item.append(button);
        item.append(inp);
        return item
    }  // form part text

    function formDatePickerAddForm(){
        var item = makeTag("li", "", {"class": "list-group-item input-group"});
        var inp = makeTag("input", "", {"class": "form-control", "placeholder": "DatePicker"});
        var button = makeTag("div", "", {"class": "input-group-btn"});
        var add = makeTag("button", "+", {"class": "btn btn-success"});
        add.click(function (){
            form_data["fields"].push({"kind": "datepicker", "label": inp.val(), "id": genToken()});
            showForm(form_data);
        });
        button.append(add);
        item.append(button);
        item.append(inp);
        return item
    }  //datepicker

    function formTimePickerAddForm(){
        var item = makeTag("li", "", {"class": "list-group-item input-group"});
        var inp = makeTag("input", "", {"class": "form-control", "placeholder": "TimePicker"});
        var button = makeTag("div", "", {"class": "input-group-btn"});
        var add = makeTag("button", "+", {"class": "btn btn-success"});
        add.click(function (){
            form_data["fields"].push({"kind": "timepicker", "label": inp.val(), "id": genToken()});
            showForm(form_data);
        });
        button.append(add);
        item.append(button);
        item.append(inp);
        return item
    } // timepicker

    function formCheckboxAddForm(){
        var item = makeTag("li", "", {"class": "list-group-item input-group"});
        var inp = makeTag("input", "", {"class": "form-control", "placeholder": "checkbox"});
        var button = makeTag("div", "", {"class": "input-group-btn"});
        var add = makeTag("button", "+", {"class": "btn btn-success"});

        var checkitems = [];

        add.click(function (){
            form_data["fields"].push({"kind": "checkbox", "label": inp.val(), "id": genToken(), "misc": checkitems});
            showForm(form_data);
        });

        var ulforbox = makeTag("ul", "", {"class": "list-group"});
        var boxitem = makeTag("li", "", {"class": "list-group-item input-group"});
        var boxinp = makeTag("input", "", {"class": "form-control", "placeholder": "Label"});
        var boxbutton = makeTag("div", "", {"class": "input-group-btn"});
        var boxadd = makeTag("button", "+", {"class": "btn btn-success"});

        boxadd.click(function (){
            checkitems.push({"subID": genToken(), "subLabel": boxinp.val()});
            boxinp.val("");
        });

        boxbutton.append(boxadd);
        boxitem.append(boxbutton);
        boxitem.append(boxinp);
        ulforbox.append(boxitem);

        button.append(add);
        item.append(button);
        item.append(inp);
        item.append(ulforbox);
        return item
    } // checkbox

    function formRadioAddForm(){
        var item = makeTag("li", "", {"class": "list-group-item input-group"});
        var inp = makeTag("input", "", {"class": "form-control", "placeholder": "RadioButton"});
        var button = makeTag("div", "", {"class": "input-group-btn"});
        var add = makeTag("button", "+", {"class": "btn btn-success"});

        var checkitems = [];

        add.click(function (){
            form_data["fields"].push({"kind": "radio", "label": inp.val(), "id": genToken(), "misc": checkitems});
            showForm(form_data);
        });

        var ulforbox = makeTag("ul", "", {"class": "list-group"});
        var boxitem = makeTag("li", "", {"class": "list-group-item input-group"});
        var boxinp = makeTag("input", "", {"class": "form-control", "placeholder": "Label"});
        var boxbutton = makeTag("div", "", {"class": "input-group-btn"});
        var boxadd = makeTag("button", "+", {"class": "btn btn-success"});

        boxadd.click(function (){
            checkitems.push({"subID": genToken(), "subLabel": boxinp.val()});
            boxinp.val("");
        });

        boxbutton.append(boxadd);
        boxitem.append(boxbutton);
        boxitem.append(boxinp);
        ulforbox.append(boxitem);

        button.append(add);
        item.append(button);
        item.append(inp);
        item.append(ulforbox);
        return item
    } // radio

    function addFormElementAdditionForms(){
        $("#form_control").append(makeTag("hr", "", {"class": "nav-divider"}));
        var title = makeTag("li", "", {"class": "list-group-item"});
        var titleinp = makeTag("input", "", {"placeholder": "Form Title", "type": "text"});
        titleinp.change(function (){
            console.log("Setting Title");
            form_data["title"] = this.value;
        });
        title.append(titleinp);
        $("#form_control").append(title);
        $("#form_control").append(makeTag("hr", "", {"class": "nav-divider"}));
        $("#form_control").append(formTextAddForm());
        $("#form_control").append(formRangeAddForm());
        $("#form_control").append(formDatePickerAddForm());
        $("#form_control").append(formTimePickerAddForm());
        $("#form_control").append(formCheckboxAddForm());
        $("#form_control").append(formRadioAddForm());
        // add various valid elements
    } // form element addtion forms


    function newForm(){
        $("#form_control").html("");
        $("#form_display").html("");
        // add forms
        form_data = {"formid": "blank_form", "title": "",
                     "fields": []};
        showForm(form_data)
    }  // new form


    function addDownloadFormResponses(formid){
        var edit_form = makeTag("li", "", {"class": "list-group-item", "id": "download_"+formid, "formid": formid});
        edit_form.append(makeTag("a", "Download Responses", {"href": "#"}));
        edit_form.click(function (){
            hitApi("/form/responses", {"formid": formid}, function (d, s, x){
                var url = d["url"];
                console.log(url);
                window.location.href=url;
            });
        });
        $("#form_control").append(edit_form);
    } // download responses


    function showForm(data){ // DONE
        $("#form_control").html("");
        form_data = data;
        var formid = data["formid"];
        $("#form_display").html("");
        $("#form_display").append(makeTag("h2", data["title"]));
        $("#form_display").append(makeTag("hr"));
        // CONTROLS FOR THE FORM
        addNewFormButton();
        addEditFormButton(formid, data);
        addDownloadFormResponses(formid);
        addDeleteFormButton(formid);
        addFormElementAdditionForms();

        var n_parts = data["fields"].length;
        for(var i=0; i < n_parts; i++){
            var part = makePart(data["fields"][i], formid);
            $("#form_display").append(part);
        }// for each part
    } // form display


    function getFormList(){
        cleanSlate();
        var form_listing = makeTag("div", "", {"class": "col-md-4", "id": "form_listing"});
        var form_display = makeTag("div", "", {"class": "col-md-4", "id": "form_display"});
        var fcd = makeTag("div", "", {"class": "col-md-4", "id": "form_control_div"});
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
    $("#formtab").click(getFormList); // form tab

    $("#reportstab").click(function (){
        cleanSlate();
        hitApi("/report", {}, function (d, s, x){
            var reports = d['report'];
            console.log(reports);
            var table = makeTag("table", '', {"class": "table table-striped table-bordered table-hover"});
            var thead = makeTag("thead");
            var row = makeTag("tr");
            var titles = makeTag("th", "Measurement");
            var mean = makeTag("th", "Mean Frequencies");
            var std = makeTag("th", "Std Deviation of Frequencies");
            row.append(titles);row.append(mean);row.append(std);
            thead.append(row);
            table.append(thead);
            table.append(makeTag("tbody", "", {"id": "reportTable"}));
            $("#mainContainer").append(table);
            for(var i=0; i<reports.length; ++i){
                showReports(reports[i][1], "reportTable", reports[i][0]);
            } // reports log
        });
    });

    $("#contenttab").click(function (){
        showCategory('_ROOT_');
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

    $("#home_link").click(cleanSlate);
    // ======================================== CONTENT

    function addCategoryItem(item){
        var listitem = makeTag("li", "", {"class": "list-group-item"});
        var name = makeTag("button", item["title"], {"class": "btn"});
        var del = makeTag("button", "X", {"class": "btn btn-danger"});
        listitem.append(del);
        listitem.append(name);
        del.click(function (){
            if(item["id"][0] == "_"){
                hitApi("/category/delete", {"catid": item["id"]}, function (d, s, x){
                    showCategory(category_trail[category_trail.length-1]);
                });
            }
            else{
                hitApi("/content/delete", {"fname": item["id"]}, function (d, s, x){
                    showCategory(category_trail[category_trail.length-1]);
                });
            }
        });
        name.click(function (){
            if(item["id"][0] == "_"){ showCategory(item["id"]);}
            else{
                hitApi("/content", {"fname": item["id"]},
                    function (d, s, x){
                        var url = d["url"];
                        window.location.href=url;
                    }  // on success of content
                );
            }
        });
        $("#categories_list").append(listitem);
    } // category item

    function showCategory(catid){
        hitApi("/category", {"catid": catid}, function(d, s, x){
            $("#mainContainer").html("");
            var list = makeTag("ul", "", {"class": "list-group col-md-4", "id": "categories_list"});
            var view = makeTag("div", "", {"class": "col-md-8", "id": "content_view"});
            $("#mainContainer").append(list);
            $("#mainContainer").append(view);
            // ADD BACK BUTTON ----------------------------
            if(catid!="_ROOT_"){
                var listitem = makeTag("li", ".. back",
                                       {"class": "bg-info list-group-item"});
                listitem.click(function (){
                    console.log("before pop", category_trail);
                    category_trail.pop();
                    var ident = category_trail[category_trail.length-1]
                    console.log("after pop", ident, category_trail);
                    showCategory(ident);
                });
                $("#categories_list").append(listitem);
                console.log(category_trail);
            }
            if(category_trail[category_trail.length-1] != catid){category_trail.push(catid);}
            // ADD REST OF ITEMS ----------------------------
            var n_items = d["contains"].length;
            for(var i=0; i<n_items; i++){
                addCategoryItem(d["contains"][i], catid);
            }
            $("#categories_list").append(makeTag("hr", "", {"class": "nav-divider"}));
            // ADD NEW CATEGORY BUTTON
            var item = makeTag("li", "", {"class": "list-group-item input-group"});
            var button = makeTag("div", "", {"class": "input-group-btn"});
            var add = makeTag("button", "+", {"class": "btn btn-success"});
            var inp = makeTag("input", "", {"class": "form-control", "placeholder": "Add new Category"});
            add.click(function (){
                var newcat = {"title": inp.val(), "id": "_"+genToken(),
                              "parent": category_trail[category_trail.length-1],
                              "contains": []};
                hitApi("/category/create", newcat,
                       function (d, s, x){
                           showCategory(category_trail[category_trail.length-1]);
                       });
            });
            button.append(add);
            item.append(button);
            item.append(inp);
            $("#categories_list").append(item);
            // ADD NEW CONTENT BUTTON----------------
            var item = makeTag("li", "", {"class": "list-group-item"});
            var form = makeTag("form", "", {"class": "form-group",
                                            "action": "/content/create",
                                            "method": "post",
                                            "enctype": "multipart/form-data",
                                            "id": "contentUploadForm"
                                           });
            item.append(form);
            // ----------------
            var title = makeTag("input", "", {"class": "form-control", "placeholder": "Content Title", "name": "title"});
            var desc = makeTag("input", "", {"class": "form-control", "placeholder": "Description", "name": "description"});
            var upload = makeTag("input", "", {"class": "form-control", "type": "file", "name": "upload", "multiple": "multiple"});
            var button = makeTag("button", "Upload", {"class": "btn btn-primary", "type": "submit"});
            var tok = makeTag("input", "", {"type": "hidden", "name": "token", "value": getCurrentToken() });
            var par = makeTag("input", "", {"type": "hidden", "name": "parent", "value":catid });


            form.append(makeTag("b", "New Content"));
            form.append(title); form.append(desc);
            form.append(tok); form.append(par);
            form.append(upload); form.append(button);


            button.click(function uploadForm(event){
                event.preventDefault();
                console.log(form.length);
                var data = new FormData(form[0]);
                button.prop("disabled", true);
                $.ajax({
                        type: "POST",
                        enctype: 'multipart/form-data',
                        url: "/content/create",
                        data: data,
                        processData: false,
                        contentType: false,
                        cache: false,
                        timeout: 600000,
                        success: function (d){
                            console.log(d);
                            $("#contenttab").click();
                        }
                });
            });


            $("#categories_list").append(item);
        });
    } // show category

    // ========================================= CALLS
    cleanSlate();
    $("#logout_button").hide();
}); // DOCUMENT READY
