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
 */

$(document).ready(function() {

    // Global storage for log and participant/color pair.
	var $logText = undefined;
    var participants = new HashTable({});

    // Click refresh button to remove all content in the input textarea
	$("#refresh").click(function() {
		$("#log_text").val("");
	});

    // Pre-processing user input, detect participants, store their names in a hash table, display tagging options.
	$("#tagger").bind("pagebeforeshow", function() {

        // Cache log input
        var logTemp = $("#input #log_text").val();
        var $logTemp = $("#input #log_temp").html(logTemp);

        // From the cached log object, remove all css style and images
        $logTemp.find("style").remove();
        $logTemp.find("td:has(img)").remove();

        // Remove system information
        $logTemp.find("div:not(:has(table))").each(function() {
            var regAction = /^\s*\*.*/;
            if (false == regAction.test($(this).text())) {
                $(this).remove();
            }
        });

        // Remove irrelevant chat
        $logTemp.find("div:has(table)").each(function() {
            var regIrrelChat = /^\(|(\uFF08).*/;
            if (true == regIrrelChat.test($(this).find("span").text())) {
                $(this).remove();
            }
        });

        // Store participant names as keys in a hashtable.
        $logTemp.find("td[style]").each(function() {

            var k = $(this).text();

            if (!participants.hasItem(k)) {

                participants.setItem(k, "");

                /**
                 * Dynamically create select menu for each participant.
                 * @type {String}
                 */
                var selectMenu = "<select>" +
                    "<option value='black'>" + k + "黑色</option>" +
                    "<option value='red'>" + k + "红色</option>" +
                    "<option value='yellow'>" + k + "黄色</option>" +
                    "<option value='pink'>" + k + "粉红</option>" +
                    "<option value='green'>" + k + "绿色</option>" +
                    "<option value='orange'>" + k + "橘色</option>" +
                    "<option value='purple'>" + k + "紫色</option>" +
                    "<option value='blue'>" + k + "蓝色</option>" +
                    "<option value='beige'>" + k + "米色</option>" +
                    "<option value='brown'>" + k + "棕色</option>" +
                    "<option value='teal'>" + k + "蓝绿</option>" +
                    "<option value='navy'>" + k + "深蓝</option>" +
                    "<option value='maroon'>" + k + "紫红</option>" +
                    "<option value='limegreen'>" + k + "莱姆</option>" +
                    "<option value='white'>" + k + "白色</option>" +
                    "</select>" +
                    "<br \>";

                $("#tagger #color_selector").append($(selectMenu)).trigger("create");
                $("#tagger select:last").attr({id: k});

            }
        });

        // Get user selection. Save selection each time the user change an option.
        $("#tagger select").change(function() {
            var k = $(this).attr("id");
            participants.setItem(k, $(this).val());
        });

		$logText = $logTemp;
        console.log("test", participants.items);

	});

    // Trigger changes in selection
    $("#tagger").bind("pageshow", function() {
        $(this).find("select").trigger("change");
    });

    $("#output").bind("pagebeforeshow", function() {

        var $logTemp = $logText;

        $logTemp.find("td[style]").each(function() {

            var k = $(this).text();

            if (participants.hasItem(k)) {
                var v = participants.getItem(k);
                $(this).prepend("[color="+v+"]");
                $(this).next().find("span").append("[/color]");
            }
        });

        $logText = $logTemp;

    });

    // Final formatting.
	$("#output").bind("pageshow", function() {

		var logText = $logText.text();

        // Remove redundant whitespace
        var regWhitespace = /[ \f\n\r\t\v\u00A0\u2028\u2029]{2,}/g;
        var regStar = /\* /g;
        var regBracket = /\[color/g;

        var logFinal = logText.replace(regWhitespace, "").replace(regStar, "\n* ").replace(regBracket, "\n[color");

        $("#output #log_output").val(logFinal);

	});

});

/**
 * Easy to use hash table
 * @param obj
 * @constructor
 */
function HashTable(obj) {

    this.length = 0;
    this.items = {};
    for(var i in obj) {
        if(obj.hasOwnProperty(i)) {
            this.items[i] = obj[i];
            this.length++;
        }
    }

    this.hasItem = function(key) {
        return this.items.hasOwnProperty(key);
    }

    this.setItem = function(key, val) {
        var previous = undefined;
        if(this.hasItem(key)) {
            previous = this.items[key];
        }
        else {
            this.length++;
        }
        this.items[key] = val;
        return previous;
    }

    this.getItem = function(key) {
        return this.hasItem(key) ? this.items[key] : undefined;
    }

    this.keys = function() {
        var keys = [];
        for(var k in this.items) {
            if(this.hasItem(k)) {
                keys.push(k);
            }
        }
        return keys;
    }

}