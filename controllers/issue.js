const { Issue, Project } = require('../models/models');

const createIssue = async (req, res) => {
	const {
		issue_title,
		issue_text,
		created_by,
		assigned_to,
		status_text,
	} = req.body;

	if (!issue_title || !issue_text || !created_by) {
		return res.status(200).json({ error: 'required field(s) missing' });
	}

	let issue = new Issue({
		issue_title: issue_title || '',
		issue_text: issue_text || '',
		created_by: new Date().toISOString(),
		updated_on: new Date().toISOString(),
		created_by: created_by || '',
		assigned_to: assigned_to || '',
		open: true,
		status_text: status_text || '',
	});

	const params = { name: req.params.project };

	const projectData = await Project.findOne({ name: req.params.project });

	if (!projectData) {
		const newProject = new Project(params);
		newProject.issues.push(issue);
		try {
			await newProject.save();

			return res.status(200).json(issue);
		} catch (err) {
			return res.status(200).json({ error: 'error saving data' });
		}
	} else {
		projectData.issues.push(issue);
		try {
			await projectData.save();

			return res.status(200).json(issue);
		} catch (err) {
			return res.status(200).json({ error: 'error saving data' });
		}
	}
};

const readIssue = async (req, res) => {
	const queries = Object.keys(req.query);

	const project = await Project.findOne({ name: req.params.project });

	if (!project) {
		return res.status(200).json([]);
	}

	const { issues } = project;

	if (queries.length === 0) {
		return res.status(200).json(issues);
	}

	const filteredIssues = issues.filter((issue) => {
		return !queries.find((query) => `${issue[query]}` !== req.query[query]);
	});

	return res.status(200).json(filteredIssues);
};

const updateIssue = async (req, res) => {
	const { _id } = req.body;

	if (!_id) {
		return res.status(200).json({ error: 'missing _id' });
	}

	const returnValues = req.body;

	delete returnValues._id;

	if (
		Object.values(returnValues).filter((value) => value !== '').length === 0
	) {
		return res.status(200).json({ error: 'no update field(s) sent', _id: _id });
	}

	const projectData = await Project.findOne({
		name: req.params.project,
	});

	if (projectData) {
		const issue = projectData.issues.find((issue) => `${issue._id}` === _id);
		if (issue) {
			projectData.issues.map((issue) => {
				if (`${issue._id}` !== _id) {
					return issue;
				}
				return {
					...issue,
					...returnValues,
					updated_on: new Date().toISOString(),
				};
			});
			const updated = await projectData.save();
			if (updated) {
				return res
					.status(200)
					.json({ result: 'successfully updated', _id: _id });
			}
		}
	}
	return res.status(200).json({ error: 'could not update', _id: _id });
};

const deleteIssue = async (req, res) => {
	const { _id } = req.body;

	if (!_id) {
		return res.status(200).json({ error: 'missing _id' });
	}
	let projectData = await Project.findOne({ name: req.params.project });

	if (projectData) {
		const newIssues = projectData.issues.filter((issue) => {
			return `${issue._id}` !== _id;
		});

		if (newIssues.length !== projectData.issues.length) {
			projectData.issues = newIssues;
			const deleted = await projectData.save();
			if (deleted) {
				return res
					.status(200)
					.json({ result: 'successfully deleted', _id: _id });
			}
		}
	}
	return res.status(200).json({ error: 'could not delete', _id: _id });
};

const deleteEverything = async (req, res) => {
	await Project.remove();
	return res.status(200).send('Removed everything');
};

module.exports = {
	createIssue,
	readIssue,
	updateIssue,
	deleteIssue,
	deleteEverything,
};
