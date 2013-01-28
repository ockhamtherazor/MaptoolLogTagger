/*!
    Copyright 2012 OckhamTheRazor
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/*
    LogTagger.js
    Aug 17 2012; OckhamTheRazor; Created.
    Aug 21 2012; OckhamTheRazor; Remove irrelevant chat completed.
    Aug 23 2012; OckhamTheRazor; Color selector completed.
    Aug 24 2012; OckhamTheRazor; Alpha release. Git repository created.
    Sept 25 2012; OckhamTheRazor; Data structure changed.
    Jan 02 2013; OckhamTheRazor; Minor function changed.
    Jan 13 2013; OckhamTheRazor; Optimize some code.
    Jan 28 2013; OckhamTheRazor; Hashtable removed. MTLT now use ECMAScript Object to store hash.
 */

$(document).ready(function() {

    // Storage for log
	var logText = undefined;
    var participants = new Object();

    // Click refresh button to remove all content in the input textarea
	$("#refresh").click(function() {
		$("#log_text").val("");
	});

    // Pre-processing user input, detect participants, display tagging options.
	$("#tagger").bind("pagebeforeshow", function() {

        // Cache log input
        logText = $("#log_temp").html($("#log_text").val());

        // From the cached log object, remove all css style and images
        logText.find("style").remove();
        logText.find("td:has(img)").remove();

        // Remove system information
        logText.find("div:not(:has(table))").each(function() {
            var regAction = /^\s*\*.*/;
            if (false == regAction.test($(this).text())) {
                $(this).remove();
            }
        });

        // Remove irrelevant chat
        logText.find("div:has(table)").each(function() {
            var regIrrelChat = /^\(|(\uFF08).*/;
            if (true == regIrrelChat.test($(this).find("span").text())) {
                $(this).remove();
            }
        });

        // Store participant names as keys
        logText.find("td[style]").each(function() {

            var k = $(this).text();

            if (!participants.hasOwnProperty(k)) {

                participants[k] = "black";

                // Dynamically create select menu for each participant
                var selectMenu = "<select>" +
                    "<option value='black'>" + k + "Black</option>" +
                    "<option value='red'>" + k + "Red</option>" +
                    "<option value='yellow'>" + k + "Yellow</option>" +
                    "<option value='pink'>" + k + "Pink</option>" +
                    "<option value='green'>" + k + "Green</option>" +
                    "<option value='orange'>" + k + "Orange</option>" +
                    "<option value='purple'>" + k + "Purple</option>" +
                    "<option value='blue'>" + k + "Blue</option>" +
                    "<option value='beige'>" + k + "Beige</option>" +
                    "<option value='brown'>" + k + "Brown</option>" +
                    "<option value='teal'>" + k + "Teal</option>" +
                    "<option value='navy'>" + k + "Navy</option>" +
                    "<option value='maroon'>" + k + "Maroon</option>" +
                    "<option value='limegreen'>" + k + "Limegreen</option>" +
                    "<option value='white'>" + k + "White</option>" +
                    "</select>" +
                    "<br \>";

                $("#color_selector").append($(selectMenu)).trigger("create");
                $("#tagger select:last").attr({id: k});

            }
        });

        // Get user selection. Save selection each time the user change an option.
        $("#tagger select").change(function() {
            var k = $(this).attr("id");
            participants[k] = $(this).val();
        });

	});

    // Trigger changes in selection
    $("#tagger").bind("pageshow", function() {
        $(this).find("select").trigger("change");
    });

    $("#output").bind("pagebeforeshow", function() {

        logText.find("td[style]").each(function() {

            var k = $(this).text();

            if (participants.hasOwnProperty(k)) {
                var v = participants[k];
                $(this).prepend("[color="+v+"]");
                $(this).next().find("span").append("[/color]");
            }
        });

    });

    // Final formatting.
	$("#output").bind("pageshow", function() {

		logText = logText.text();

        // Remove redundant whitespace
        var regWhitespace = /[ \f\n\r\t\v\u00A0\u2028\u2029]{2,}/g;
        var regStar = /\* /g;
        var regBracket = /\[color/g;

        var logFinal = logText.replace(regWhitespace, "").replace(regStar, "\n* ").replace(regBracket, "\n[color");

        $("#log_output").val(logFinal);

	});

});
