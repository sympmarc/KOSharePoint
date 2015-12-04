// Constructor for answers
var Answer = function (data) {
    this.name = ko.observable(data.name);
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

    // Function to handle a user clicking an answer
    self.surveyAnswer = function (answer) {
        self.selectedAnswer(answer.name());
    }
};

ko.applyBindings(new ViewModel());
