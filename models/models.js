const mongoose = require('mongoose');

const date = new Date().toISOString();

const IssueSchema = new mongoose.Schema({
	assigned_to: { type: String, default: '' },
	status_text: { type: String, default: '' },
	open: { type: Boolean, default: true },
	issue_title: { type: String, default: true },
	issue_text: { type: String, default: true },
	created_by: { type: String, default: true },
	updated_on: { type: String, default: date },
	created_on: { type: String, default: date },
});

const Issue = mongoose.model('Issue', IssueSchema);

const ProjectSchema = new mongoose.Schema({
	name: { type: String, required: true },
	issues: [IssueSchema],
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = {
	Issue,
	Project,
};
