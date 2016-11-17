"use strict";

var gulp = require('gulp');
var watch = require('gulp-watch');
var cache = require('gulp-cache');
var spsave = require('gulp-spsave');

//sensitive data stored in external file:
var settings = require("./settings.json");

gulp.task('default', function () {
	// Default task code
});

gulp.task('clear', function (done) {
	return cache.clearAll(done);
});

gulp.task("copyToSharePoint", function () {
	return gulp.src(settings.srcFiles, {base: settings.rootFolder})
		.pipe(cache(
			spsave({
				username: settings.username,
				password: settings.pwd,
				siteUrl: settings.siteCollURL,
				folder: settings.destFolder,
				flatten: false,
				base: "./"
			}), {
				fileCache: new cache.Cache({cacheDirName: settings.projectname + '-cache'}),
				name: settings.username + "." + settings.projectname
			})
		);
});

gulp.task("watch", function () {
	gulp.watch(settings.srcFiles, ["copyToSharePoint"]);
});