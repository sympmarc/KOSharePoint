// Constructor for answers
var Answer = function (data) {
    this.name = ko.observable(data.name);
    this.count = ko.observable(0);
};

var ViewModel = function () {

    // This just makes it easier to understand things.
    var self = this;

    // Set up our variables
    self.question = ko.observable("What is your favorite color?");
    self.answers = ko.observableArray([
        new Answer({
            name: "Red"
        }),
        new Answer({
            name: "Blue"
        }),
        new Answer({
            name: "Green"
        })
    ]);
    self.selectedAnswer = ko.observable("");
    self.totalCount = ko.observable(0);

    // Function to handle a user clicking an answer
    self.surveyAnswer = function (answer) {
        self.selectedAnswer(answer.name());
        var thisAnswer = ko.utils.arrayFirst(self.answers(), function (ans) {
            return ans.name() === answer.name();
        });
        thisAnswer.count(thisAnswer.count() + 1);
        self.totalCount(self.totalCount() + 1);
        self.selectedAnswer(answer.name());
        self.currentView("results");
    }
};

// Give some time for libraries to load
setTimeout(function() {
    ko.applyBindings(new ViewModel());
}, 500);