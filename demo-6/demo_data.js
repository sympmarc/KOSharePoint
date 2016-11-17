"use strict";

var demo = window.demo || {};

(function () {

    demo.getQuestion = function () {

        var p = $.Deferred();

        $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl +
            "/_api/web/lists/getbytitle('Surveys')/items?" +
            "$select=ID,Title,Answers" +
            "&$orderby=Modified desc" +
            "&$top=1",
            method: "GET",
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {

                var questionData = data.d.results[0];
                var question = {};

                question.Id = questionData.ID;
                question.Title = questionData.Title;
                question.Answers = JSON.parse(questionData.Answers);

                p.resolveWith(question);
            },
            error: function (data) {
                failure(data); // Do something with the error
            }
        });

        return p.promise();

    };
// Save the info to the SharePoint list
    demo.saveQuestion = function (ID, payload) {

        // Write to list
        $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl +
            "/_api/web/lists/getbytitle('Surveys')/items(" + ID + ")",
            method: "POST",
            data: ko.toJSON(payload),
            contentType: "application/json;odata=nometadata",
            headers: {
                'X-RequestDigest': $('#__REQUESTDIGEST').val(),
                'X-HTTP-Method': 'MERGE',
                'If-Match': "*"
            },
            success: function (data) {

            },
            error: function (data) {
                failure(data); // Do something with the error
            }
        });

    };

})();
