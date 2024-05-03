


/* First, we deal with Internet Explorer and Edge... */
if (navigator.appName == 'Microsoft Internet Explorer' || (navigator.appName == "Netscape" && (navigator.appVersion.indexOf('Trident') > -1 || navigator.appVersion.indexOf('Edge') > -1))) {
    $("#floating-screenshot").css("display", "none");
}



var orbitViewer = null;
var urlController = null;

/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("sidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("sidenav").style.width = "0";
}

$( function() {







    function showSuccessAlert(text) {

        $("#popoverSuccessText").html(text);
        $("#objectLoaded").addClass("in");
        setTimeout(function() {
            $("#objectLoaded").removeClass("in");
        }, 3000);
    }


    function showWarnAlert(text) {

        $("#popoverWarningText").html(text);
        $("#objectNotFound").addClass("in");
        setTimeout(function() {
            $("#objectNotFound").removeClass("in");
        }, 3000);
    }


    $("#floating-sim-play-backward").click(function(e) {
        orbitViewer.setSimulationMovingBackward();
        orbitViewer.startSimulation();
    });

    $("#floating-sim-step-backward").click(function(e) {
        orbitViewer.stepSimulationBackward();
        urlController.setTimeMillis(orbitViewer.getSimulationTimeMillis());
    });

    $("#floating-sim-stop").click(function(e) {
        orbitViewer.stopSimulation();
        urlController.setTimeMillis(orbitViewer.getSimulationTimeMillis());
    });

    $("#floating-sim-play-forward").click(function(e) {
        orbitViewer.setSimulationMovingForward();
        orbitViewer.startSimulation();
    });

    $("#floating-sim-step-forward").click(function(e) {
        orbitViewer.stepSimulationForward();
        urlController.setTimeMillis(orbitViewer.getSimulationTimeMillis());
    });

    $("#floating-sim-now").click(function(e) {
        orbitViewer.setSimulationDateToNow();
        urlController.setTimeMillis(orbitViewer.getSimulationTimeMillis());
    });

    $("#floating-fullscreen").click(function(e) {
        orbitViewer.toggleFullScreen();
    });

    $("#floating-screenshot").click(function(e) {
        orbitViewer.captureScreenshot();
    });



    $("#intervalDropdownOptions > li > a").click(function(e) {
        setInterval(this.innerText);
    });

    function setInterval(intervalText) {
        var interval = JPL.Config.timeInterval;
        switch (intervalText) {
            case "1 Second":
                interval = JPL.TimeIntervals.SECOND
                break;
            case "1 Minute":
                interval = JPL.TimeIntervals.MINUTE;
                break;
            case "1 Hour":
                interval = JPL.TimeIntervals.HOUR;
                break;
            case "6 Hours":
                interval = JPL.TimeIntervals.SIXHOUR;
                break;
            case "1 Day":
                interval = JPL.TimeIntervals.DAY;
                break;
            case "3 Days":
                interval = JPL.TimeIntervals.THREE_DAYS;
                break;
            case "1 Week":
                interval = JPL.TimeIntervals.WEEK;
                break;
            case "10 Days":
                interval = JPL.TimeIntervals.TEN_DAYS;
                break;
            case "1 Month":
                interval = JPL.TimeIntervals.MONTH;
                break;
            case "3 Months":
                interval = JPL.TimeIntervals.THREE_MONTHS;
                break;
            case "6 Months":
                interval = JPL.TimeIntervals.SIX_MONTHS;
                break;
            case "1 Year":
                interval = JPL.TimeIntervals.YEAR;
                break;
        }
        $("#interval-label").text(intervalText);
        orbitViewer.setSimulationInterval(interval);
        urlController.setSimulationInterval(interval);
    }




    $("#planet-labels-toggle").change(function(e) {
        orbitViewer.setPlanetLabelsVisible($(this).prop('checked'));
        urlController.setShowPlanetLabels($(this).prop('checked'));
    });
    $("#date-label-toggle").change(function(e) {
        orbitViewer.setDateLabelVisibility($(this).prop('checked'));
        urlController.setShowDateLabel($(this).prop('checked'));
    });
    $("#distance-label-toggle").change(function(e) {
        orbitViewer.setDistanceLabelsVisibility($(this).prop('checked'));
        urlController.setShowDistanceLabels($(this).prop('checked'));
    });
    $("#ecliptic-grid-toggle").change(function(e) {
        orbitViewer.setEclipticGridVisiblity($(this).prop('checked'));
        urlController.setShowEclipticGrid($(this).prop('checked'));
    });
    $("#ecliptic-axis-toggle").change(function(e) {
        orbitViewer.setEclipticAxisVisibility($(this).prop('checked'));
        urlController.setShowEclipticAxis($(this).prop('checked'));
    });
    $("#show-controls-toggle").change(function(e) {
        urlController.setShowFloatingControls($(this).prop('checked'));
        $("#floating_controls").css("display", ($(this).prop('checked') ? "block" : "none"));
    });
    $("#close-settings-link").click(function(e) {
        $("#sidenav_content_main").css("display", "block");
        $("#sidenav_content_settings").css("display", "none");
    });
    $("#sidenav-settings-link").click(function(e) {
        $("#sidenav_content_main").css("display", "none");
        $("#sidenav_content_settings").css("display", "block");
    });
    $("#lookAtDropdownOptions > li > a").click(function(e) {

        var lookingFrom = orbitViewer.getViewFrom();
        if (lookingFrom == "Earth" && this.innerText == "Earth") {
            showWarnAlert("Cannot look at Earth: Already viewing from Earth.");
            return;
        }

        if (!orbitViewer.setFocusOn(this.innerText)) {
            showWarnAlert("Unable to focus on object");
        } else {
            onFocusChanged(this.innerText);
            urlController.setLookAt(this.innerText);
        }
    });
    function addObjectToLookAtMenu(name) {
        $("<li><a href='#'>" + name + "</a></li>")
            .appendTo($("#lookAtDropdownOptions"))
            .click(function(e) {
                if (!orbitViewer.setFocusOn(name)) {
                    showWarnAlert("Unable to focus on object");
                } else {
                    onFocusChanged(this.innerText);
                    urlController.setLookAt(name);
                }
            });
    }

    function onFocusChanged(systemName) {

        $( "#lookat-dropdown-label").text("Look At: " + systemName);
        $( "#lookAtDropdownOptions > li > a" ).css( "font-weight", "normal" );
        $( "#lookAtDropdownOptions > li > a:contains('" + systemName + "')" ).css( "font-weight", "bold" );
    }




    $("#view-from-above").click(function(e){
        orbitViewer.setViewFromAbove();
        urlController.setViewFrom("above");
        $( "#lookfrom-dropdown-label").text("Look From: Above");
        $( "#lookFromDropdownOptions > li > a" ).css( "font-weight", "normal" );
        $( "#lookFromDropdownOptions > li > a:contains('Above')" ).css( "font-weight", "bold" );
        e.preventDefault();
    });

    $("#view-from-ecliptic").click(function(e){
        orbitViewer.setViewFromEcliptic();
        urlController.setViewFrom("ecliptic");
        $( "#lookfrom-dropdown-label").text("Look From: Ecliptic");
        $( "#lookFromDropdownOptions > li > a" ).css( "font-weight", "normal" );
        $( "#lookFromDropdownOptions > li > a:contains('Ecliptic')" ).css( "font-weight", "bold" );
        e.preventDefault();
    });

    $("#view-from-earth").click(function(e){

        var planet = orbitViewer.getFocusOn();
        if (planet && planet.getName() == "Earth") {
            showWarnAlert("Cannot view from Earth: Already looking at Earth.");
            return;
        }

        orbitViewer.setViewFromEarth();
        urlController.setViewFrom("earth");
        $( "#lookfrom-dropdown-label").text("Look From: Earth");
        $( "#lookFromDropdownOptions > li > a" ).css( "font-weight", "normal" );
        $( "#lookFromDropdownOptions > li > a:contains('Earth')" ).css( "font-weight", "bold" );
        e.preventDefault();
    });

    $("#view-from-default").click(function(e){
        orbitViewer.setAsDefaultView();
        $( "#lookfrom-dropdown-label").text("Look From: Default");
        $( "#lookFromDropdownOptions > li > a" ).css( "font-weight", "normal" );
        $( "#lookFromDropdownOptions > li > a:contains('Default')" ).css( "font-weight", "bold" );
        e.preventDefault();
    });

    function onWebGlUnsupported() {
        console.info("No WebGL");
        $("#no_webgl").css("display", "block");
        var youtube = $("<iframe/>", {
            height: 315,
            width: 560,
            src: JPL.Config.demoVideo,
            frameborder: 0,
            allowfullscreen: "allowfullscreen"
        }).appendTo($("#no_webgl"));
    }

    function isInIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    function updateUiDateInputsWith(forInline, forInput) {
        if ($('#datetimepicker-inline').data("DateTimePicker")) {
            $('#datetimepicker-inline').data("DateTimePicker").date(forInline);
        }

        if ($('#datetimepicker-input')) {
            $('#datetimepicker-input').val(forInput);
        }
    }

    function updateUiDateInputs() {
        if (orbitViewer) {
            updateUiDateInputsWith(
                new Date(orbitViewer.getSimulationTimeMillis()),
                moment(orbitViewer.getSimulationTimeMillis()).format(JPL.Config.datePicker.format)
            );
        } else {
            updateUiDateInputsWith(
                JPL.Util.julianToDate(JPL.Util.julianNow(true)),
                moment(JPL.Util.julianToDate(JPL.Util.julianNow(true))).format(JPL.Config.datePicker.format)
            );
        }
    }

    $('#floating-datetime-show').popover({
        html:true,
        container: 'body',
        content: "<input type=\"text\" id=\"datetimepicker-input\" class=\"form-control\" placeholder=\"YYYY-MM-DD HH:mm\" ><div id=\"datetimepicker-inline\" style='width:400px;'></div>"
    });

    $('#floating-datetime-show').tooltip({

    });
    $("#floating-datetime-show").click(function() {

        var minmaxValidDates = orbitViewer.getValidTimeRangeMillis();

        $('#datetimepicker-inline').datetimepicker({
            inline: true,
            sideBySide: true,
            keyBinds: {
                enter: function() {
                    $('#floating-datetime-show').popover('hide');
                },
                escape: function() {
                    $('#floating-datetime-show').popover('hide');
                }
            },
            format: JPL.Config.datePicker.format,
            minDate: moment(new Date(minmaxValidDates.minimum)),
            maxDate: moment(new Date(minmaxValidDates.maximum)),
            showTodayButton: true
        });

        $('#datetimepicker-inline').on('dp.change', function (e) {
            orbitViewer.setSimulationToDateMillis(e.date.valueOf());
            $('#datetimepicker-input').val(moment(e.date).format(JPL.Config.datePicker.format));
        });

        updateUiDateInputs();


        $('#datetimepicker-input').focus(function() {
            $('#datetimepicker-input').attr("data-old-value", $('#datetimepicker-input').val());
        });
        $('#datetimepicker-input').change(function(e) {

            var textValue = this.value;
            var m = moment(textValue, JPL.Config.datePicker.format);

            var minmaxValidDates = orbitViewer.getValidTimeRangeMillis();
            var minDate = moment(new Date(minmaxValidDates.minimum));
            var maxDate = moment(new Date(minmaxValidDates.maximum));


            if (m.isValid() && m >= minDate && m <= maxDate) {
                $('#datetimepicker-inline').data("DateTimePicker").date(m);
                orbitViewer.setSimulationToDateMillis(m.valueOf());


            } else {
                this.value = $('#datetimepicker-input').attr("data-old-value");
                return;
            }

            $('#datetimepicker-input').attr("data-old-value", $('#datetimepicker-input').val());
        });


        $( "#datetimepicker-input").keydown(function(evt) {
            if (evt.keyCode == 13 || evt.keyCode == 27) {
                $('#floating-datetime-show').popover('hide');
            }
        });
    });


    urlController = new JPL.SiteUrlController(function(u) {
        $("#permalink-text").val(document.location.href);
    });
    urlController.start();

    $('[data-toggle="tooltip"]').tooltip();

    var noMenu = JPL.AppEnv.getUrlVar("nomenu");
    if (noMenu) {
        $("#open-sidenav-button").css("display", "none");
    }

    $("#sidenav-sim-play").prop('disabled', false);
    $("#sidenav-sim-stop").prop('disabled', true);
    orbitViewer = new JPL.OrbitViewer({
        onWebGlUnsupported: function() {
            onWebGlUnsupported();
        },
        onPlay: function(){
            $("#sidenav-sim-play").prop('disabled', true);
            $("#sidenav-sim-stop").prop('disabled', false);
        },
        onStop: function() {
            $("#sidenav-sim-play").prop('disabled', false);
            $("#sidenav-sim-stop").prop('disabled', true);

            updateUiDateInputs();

            urlController.setTimeMillis(orbitViewer.getSimulationTimeMillis());

        },
        onPrimaryBodyLoaded: function(system) {
            if (system.getName() == urlController.getLookAt()) {
                orbitViewer.setFocusOn(system.getName());
            }
            if (system.getName() !== "Earth") {
                system.setMoonsVisible(true);
            }

            if ((system.getName() !== "Sun" && system.getSystemMainBodyType() == "planet") || system.getName() == "Pluto") {
                createSystemOptions(system);
            }

        },
        onFocusChanged: function(system, previous) {
            onFocusChanged(system.getName())
            urlController.setLookAt(system.getName());
            setSystemOptionsEnabled(previous, true);
            setSystemOptionsEnabled(system, false);

        },
        onViewChanged: function(viewConfig, complete) {
            if (complete) {
                urlController.resetViewFrom();
                urlController.setView(orbitViewer.getViewConfiguration());
            }
        },
        onDateChanged : function() {

            updateUiDateInputs();

            if (!orbitViewer.isAnimating()) {
                urlController.setTimeMillis(orbitViewer.getSimulationTimeMillis());
            }
        },
        onTimeTick : function(tickJulian, tickDate) {
        },
        onReady : function() {

        }
    });
    orbitViewer.setFocusOn("SSB");

    document.addEventListener( 'mouseup', function(evt) {
        //urlController.resetViewFrom();
       //urlController.setView(orbitViewer.getViewConfiguration());
    }, false );



    var simInterval = urlController.getSimulationInterval();
    if (simInterval) {
        setInterval(JPL.timeIntervalToText(simInterval));
    } else {
        setInterval(JPL.timeIntervalToText(JPL.Config.timeInterval));
    }


    var setTime = urlController.getTimeMillis();
    if (setTime) {
        orbitViewer.setSimulationToDateMillis(setTime);
    }

    var onSmallBodyLoaded = function(identifier, system) {
        //showSuccessAlert("Object '" + identifier + "' loaded");
        addObjectToLookAtMenu(system.getName());
        createSystemOptions(system);
        if (system.getName() == urlController.getLookAt()) {
            orbitViewer.setFocusOn(system.getName());
        }
    };

    var load = urlController.getLoad();
    if (load !== undefined && load instanceof Array) {
        for (var i = 0; i < load.length; i++) {
            orbitViewer.loadSmallBody(load[i], onSmallBodyLoaded);
        }
    }

    var elem = urlController.getElements();
    if (elem) {
        orbitViewer.loadElementsString(elem, onSmallBodyLoaded, function(elem, err) {
            console.info("Element string property '" + err + "' missing or invalid");
        });
    }



    var viewFrom = urlController.getViewFrom();
    if (viewFrom == "above") {
        orbitViewer.setViewFromAbove();
    }

    var showPlanetLabels = urlController.getShowPlanetLabels();
    if (showPlanetLabels !== undefined) {
        orbitViewer.setPlanetLabelsVisible(showPlanetLabels);
        $('#planet-labels-toggle').bootstrapToggle(showPlanetLabels ? 'on' : 'off');
    }

    var showDistanceLabels = urlController.getShowDistanceLabels();
    if (showDistanceLabels !== undefined) {
        orbitViewer.setDistanceLabelsVisibility(showDistanceLabels);
        $('#distance-labels-toggle').bootstrapToggle(showDistanceLabels ? 'on' : 'off');
    }

    var showFloatingControls = urlController.getShowFloatingControls();
    if (showFloatingControls !== undefined) {
        $("#floating_controls").css("display", (showFloatingControls ? "block" : "none"));
        $('#show-controls-toggle').bootstrapToggle(showFloatingControls ? 'on' : 'off');
    }

    var showEclipticGrid = urlController.getShowEclipticGrid();
    if (showEclipticGrid !== undefined) {
        orbitViewer.setEclipticGridVisiblity(showEclipticGrid);
        $('#ecliptic-grid-toggle').bootstrapToggle(showEclipticGrid ? 'on' : 'off');
    }

    var showEclipticAxis = urlController.getShowEclipticAxis();
    if (showEclipticAxis !== undefined) {
        orbitViewer.setEclipticAxisVisibility(showEclipticAxis);
        $('#ecliptic-axis-toggle').bootstrapToggle(showEclipticAxis ? 'on' : 'off');
    }

    var showDateLabel = urlController.getShowDateLabel();
    if (showDateLabel !== undefined) {
        orbitViewer.setDateLabelVisibility(showDateLabel);
        $('#date-label-toggle').bootstrapToggle(showDateLabel ? 'on' : 'off');
    }


    var viewConfig = urlController.getView();
    if (viewConfig) {
        orbitViewer.setViewConfiguration(viewConfig);
    }



    function fetchAutoComplete(req, callback) {

        // Let's not overload the query system with overly simplistic searches.
        if (req.term && req.term.length < 4) {
            return;
        }

        $.ajax({
            url: "{url}?sstr=*{search}*".replace("{url}", JPL.Config.sbdb)
                                        .replace("{search}", req.term),
            dataType: "json",
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == 300) {
                    var data = $.parseJSON(jqXHR.responseText);
                    var values = [];
                    if (data.list) {
                        for (var i = 0; i < data.list.length; i++) {
                            values.push(data.list[i].name)
                        }
                    }
                    callback(values);

                }


            },
            success: function (data, textStatus, jqxhr) {

            }
        }).done(function (data) {
            if (data.object && data.object.fullname) {
                callback([data.object.fullname]);
            }


        });
    }

    function onAddObjectSubmit() {

        var search = $( "#addObjectNameBox").val();

        if (search == null || search.length == 0) {
            console.info("Invalid search term");
            return;
        }

        if (search.match(/[0-9]+ [A-Za-z]+ \([0-9]{4} [A-Z0-9]{2,5}\)/)) { // Full SBDB Name
            search = /^[0-9]+/.exec(search)[0];
        }
        orbitViewer.loadSmallBody(search,
            function(identifier, system) {
                showSuccessAlert("Object '" + identifier + "' loaded");
                addObjectToLookAtMenu(system.getName());
                urlController.addToLoad(system.getApiIdentifier());
                createSystemOptions(system);
            },
            function(identifier) {
                showWarnAlert("Object '" + identifier + "' not found");
            }
        );

        $( "#addObjectNameBox").val("");
    }

    $( "#addObjectNameBox").keydown(function(evt) {
        if (evt.keyCode == 13) {
            onAddObjectSubmit();
            $('#addObjectModel').modal('toggle');
        } else if (evt.keyCode == 27) {
            $( "#addObjectNameBox").val("");
        }
    });

    if (JPL.Config.addObject.autoSuggestEnabled) {
        $( "#addObjectNameBox" ).autocomplete({
            source: function(req, callback) {
                fetchAutoComplete(req, callback);
            }
        });

    }

    $( "#addObjectSubmit").click(function(evt) {
        onAddObjectSubmit();
    });




    function setSystemOptionsEnabled(system, enabled) {
        if (system) {
            //$("#" + system.getName().hashCode() + "-primary").attr("disabled", (enabled ? null : "true"));
           // $("#" + system.getName().hashCode() + "-moons").attr("disabled", (enabled ? null : "true"));
            //$("#" + system.getName().hashCode() + "-orbit").attr("disabled", (enabled ? null : "true"));
            $("#" + system.getName().hashCode() + "-label").attr("disabled", (enabled ? null : "true"));
            //$("#" + system.getName().hashCode() + "-droplines").attr("disabled", (enabled ? null : "true"));
        }
    }


    function createSystemOptionsCheck(label, checked, id, onclick) {
        return $("<div/>").addClass("checkbox")
                    .append($("<label/>")
                        .append($("<input/>")
                            .attr("type", "checkbox")
                            .attr("id", id)
                            .attr("checked", (checked ? "checked" : false))
                            .click(onclick))
                        .append(label));
    }

    function createSystemOptions(system) {

        var optionsContainer = $("<div/>").addClass("system-options-container");
        optionsContainer.append($("<div/>").addClass("system-options-primary").append(createSystemOptionsCheck(system.getName(), true, system.getName().hashCode() + "-primary", function(evt) {

            if (this.checked) {
                $("#" + system.getName().hashCode() + "-moons").attr("disabled", null);
                $("#" + system.getName().hashCode() + "-orbit").attr("disabled", null);
                $("#" + system.getName().hashCode() + "-label").attr("disabled", null);
                $("#" + system.getName().hashCode() + "-droplines").attr("disabled", null);

                system.setMoonsVisible($("#" + system.getName().hashCode() + "-moons").prop("checked"));
                system.setOrbitVisible($("#" + system.getName().hashCode() + "-orbit").prop("checked"));
                system.setBodyLabelVisible($("#" + system.getName().hashCode() + "-label").prop("checked"));
                system.setOrbitDropLinesVisible($("#" + system.getName().hashCode() + "-droplines").prop("checked"));

            } else {
                $("#" + system.getName().hashCode() + "-moons").attr("disabled", "true");
                $("#" + system.getName().hashCode() + "-orbit").attr("disabled", "true");
                $("#" + system.getName().hashCode() + "-label").attr("disabled", "true");
                $("#" + system.getName().hashCode() + "-droplines").attr("disabled", "true");

                system.setMoonsVisible(false);
                system.setOrbitVisible(false);
                system.setBodyLabelVisible(false);
                system.setOrbitDropLinesVisible(false);
            }

            system.setPlanetVisibility(this.checked);
        })));

        var subOptions = $("<div/>").addClass("system-suboptions-container");

        if (system.getMoons().length > 0) {
            var check = createSystemOptionsCheck((system.getMoons().length == 1 ? "Moon" : "Moons"),system.areMoonsVisible(), system.getName().hashCode() + "-moons", function(evt) {
                system.setMoonsVisible(this.checked);
            });
            subOptions.append(check);
        }

        subOptions.append(createSystemOptionsCheck("Orbit", true, system.getName().hashCode() + "-orbit", function(evt) {
                system.setOrbitVisible(this.checked);
            }))
            .append(createSystemOptionsCheck("Label", true, system.getName().hashCode() + "-label", function(evt) {
                system.setBodyLabelVisible(this.checked);
            }));

        if (system.isCustomLoadedObject()) {
            subOptions.append(createSystemOptionsCheck("Drop Lines", true, system.getName().hashCode() + "-droplines", function(evt) {
                system.setOrbitDropLinesVisible(this.checked);
            }))
        }

        optionsContainer.append(subOptions);
        $("#system-options-outter-container").append(optionsContainer);

    }

    orbitViewer.start();
});
