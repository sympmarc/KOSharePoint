"use strict";

var demo = window.demo || {};

(function () {

    demo.ViewModel = function () {

        // This just makes it easier to understand things.
        var self = this;

        // Define variables
        self.currentView = ko.observable("ask");
        self.selectedAnswer = ko.observable("");
        self.totalCount = ko.observable(0);

        self.questionId = ko.observable();
        self.question = ko.observable();
        self.answers = ko.observableArray();

        // Get the info from the SharePoint list
        var pQuestion = demo.getQuestion();
        pQuestion.then(function () {
            self.questionId(this.Id);
            self.question(this.Title);
            self.answers(this.Answers);

            var total = 0;
            for (var i = 0; i < this.Answers.length; i++) {
                total = total + this.Answers[i].count;
            }
            self.totalCount(total);


        });


        // Function to handle a user clicking an answer
        self.surveyAnswer = function (answer) {

            // Set the current answer
            self.selectedAnswer(answer.name);

            // Update counts
            answer.count++;
            self.totalCount(self.totalCount() + 1);

            // Write the data into the SharePoint list
            self.saveQuestion();

            // Switch the view
            self.currentView("results");
        };

        // Save the info to the SharePoint list
        self.saveQuestion = function () {

            // Build up the payload
            var payload = {
                Answers: ko.toJSON(self.answers())
            };

            demo.saveQuestion(self.questionId(), payload);

        }

    };

    ko.bindingHandlers.responseBar = {

        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

            var el = $(element);
            var values = valueAccessor();

            var thisName = ko.utils.unwrapObservable(values.name);
            var thisCount = ko.utils.unwrapObservable(values.count);
            var thisTotal = ko.utils.unwrapObservable(values.total);

            el.append("<div class='survey-label'>" + thisName + "</div>");
            el.append("<div class='survey-count'>" + thisCount + "</div>");
            el.append("<div class='clear'></div>");

        },

        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

            var el = $(element);
            var values = valueAccessor();

            var thisName = ko.utils.unwrapObservable(values.name);
            var thisCount = ko.utils.unwrapObservable(values.count);
            var thisTotal = ko.utils.unwrapObservable(values.total);

            var thisWidth = 100 * (thisCount / thisTotal);

            el.find(".survey-count").replaceWith("<div class='survey-count' style='width: " + thisWidth + "%;' > " + thisCount + " </div>");

        }

    };

// Give some time for libraries to load
    setTimeout(function () {
        ko.applyBindings(new demo.ViewModel());
    }, 500);

})();