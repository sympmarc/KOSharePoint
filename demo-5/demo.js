// Constructor for answers
var Answer = function(data) {
	this.name = ko.observable(data.name);
	this.count = ko.observable(data.count);
};

var ViewModel = function() {

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
	self.getQuestion = function() {
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
			success: function(data) {
				self.questionId(data.d.results[0].Id);
				self.question(data.d.results[0].Title);
				var answersText = data.d.results[0].Answers;
				var answers = ko.utils.parseJson(answersText);
				ko.utils.arrayForEach(answers, function(ans) {
					self.answers.push(new Answer(ans));
					self.totalCount(self.totalCount() + ans.count);
				})
			},
			error: function(data) {
				failure(data); // Do something with the error
			}
		});
	};
	self.getQuestion();

	// Function to handle a user clicking an answer
	self.surveyAnswer = function(answer) {

		// Set the current answer
		self.selectedAnswer(answer.name());

		// Update counts
		answer.count(answer.count() + 1);
		self.totalCount(self.totalCount() + 1);

		// Write the data into the SharePoint list
		self.saveQuestion();

		// Switch the view
		self.currentView("results");
	};

	// Save the info to the SharePoint list
	self.saveQuestion = function() {

		// Build up the payload
		var payload = {
			Answers: ko.toJSON(self.answers())
		};

		// Witte to list
		$.ajax({
			url: _spPageContextInfo.webAbsoluteUrl +
				"/_api/web/lists/getbytitle('Surveys')/items(" + self.questionId() + ")",
			method: "POST",
			data: ko.toJSON(payload),
			contentType: "application/json;odata=nometadata",
			headers: {
				'X-RequestDigest': $('#__REQUESTDIGEST').val(),
				'X-HTTP-Method': 'MERGE',
				'If-Match': "*"
			},
			success: function(data) {

			},
			error: function(data) {
				failure(data); // Do something with the error
			}
		});
	}

};

ko.bindingHandlers.responseBar = {

	init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

		var el = $(element);
		var values = valueAccessor();

		var thisName = ko.utils.unwrapObservable(values.name);
		var thisCount = ko.utils.unwrapObservable(values.count);
		var thisTotal = ko.utils.unwrapObservable(values.total);

		el.append("<div class='survey-label'>" + thisName + "</div>");
		el.append("<div class='survey-count'>" + thisCount + "</div>");
		el.append("<div class='clear'></div>");

	},

	update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

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
setTimeout(function() {
	ko.applyBindings(new ViewModel());
}, 500);