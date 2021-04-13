'use strict';

const {
	createIssue,
	readIssue,
	updateIssue,
	deleteIssue,
	deleteEverything,
} = require('../controllers/issue');

module.exports = function (app) {
	app
		.route('/api/issues/:project')

		.get(readIssue)

		.post(createIssue)

		.put(updateIssue)

		.delete(deleteIssue);

	app.route('/api/clearapi').delete(deleteEverything);
};
