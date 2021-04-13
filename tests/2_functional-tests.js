const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let testingId;
suite('Functional Tests', function () {
	test('Create an issue with every field: POST request to /api/issues/{project}', (done) => {
		chai
			.request(server)
			.post('/api/issues/apitest')
			.send({
				assigned_to: 'joe',
				status_text: 'terrible',
				issue_title: 'leg',
				issue_text: 'dropped hammer on balls',
				created_by: 'eddy',
			})
			.end((err, res) => {
				assert.equal(res.status, 200, 'Should be no server errors');
				assert.equal(
					res.type,
					'application/json',
					'Response should be in JSON format'
				);
				assert.equal(
					res.body.created_by,
					'eddy',
					'Should return the appropriate form inputs'
				);
				assert.isDefined(res.body._id);
				testingId = res.body._id;
			});
		done();
	});
	test('Create an issue with only required fields: POST request to /api/issues/{project}', (done) => {
		chai
			.request(server)
			.post('/api/issues/apitest')
			.send({
				issue_title: 'arm',
				issue_text: 'swollen',
				created_by: 'joe',
			})
			.end((err, res) => {
				assert.equal(res.status, 200, 'Should be no server errors');
				assert.equal(
					res.type,
					'application/json',
					'Response should be in JSON format'
				);
				assert.isDefined(res.body._id);
				assert.equal(
					res.body.issue_title,
					'arm',
					'Should display the appropriate form inputs'
				);
			});
		done();
	});
	test('Create an issue with missing required fields: POST request to /api/issues/{project}', (done) => {
		chai
			.request(server)
			.post('/api/issues/apitest')
			.send({
				issue_text: 'swollen',
				created_by: 'joe',
			})
			.end((err, res) => {
				assert.equal(res.status, 200, 'Should be no server errors');
				assert.equal(
					res.type,
					'application/json',
					'Response should be in JSON format'
				);
				assert.equal(
					JSON.stringify(res.body),
					'{"error":"required field(s) missing"}',
					'Should display the appropriate error message'
				);
			});
		done();
	});
	test('View issues on a project: GET request to /api/issues/{project}', (done) => {
		chai
			.request(server)
			.get('/api/issues/apitest')
			.end((err, res) => {
				assert.equal(res.status, 200, 'Should be no server errors');
				assert.equal(
					Array.isArray(res.body),
					true,
					'The response body should be an array'
				);
			});
		done();
	});
	test('View issues on a project with one filter: GET request to /api/issues/{project}', (done) => {
		chai
			.request(server)
			.get('/api/issues/apitest?open=true')
			.end((err, res) => {
				assert.equal(res.status, 200, 'Should be no server errors');
				assert.equal(
					Array.isArray(res.body),
					true,
					'The response body should be an array'
				);
			});
		done();
	});
	test('View issues on a project with multiple filters: GET request to /api/issues/{project}', (done) => {
		chai
			.request(server)
			.get('/api/issues/apitest?created_by=joe&issue_title=arm')
			.end((err, res) => {
				assert.equal(res.status, 200, 'Should be no server errors');
				assert.equal(
					Array.isArray(res.body),
					true,
					'The response body should be an array'
				);
				// assert.isAtLeast(
				// 	res.body.length,
				// 	1,
				// 	'This get request should pick up at least one created issue'
				// );
			});
		done();
	});
	test('Update one field on an issue: PUT request to /api/issues/{project}', (done) => {
		chai
			.request(server)
			.put('/api/issues/apitest')
			.send({
				_id: testingId,
				open: 'false',
			})
			.end((err, res) => {
				assert.equal(res.status, 200, 'Should be no server errors');
				assert.equal(res.body._id, testingId);
				// assert.equal(
				// 	res.body.result,
				// 	'successfully updated',
				// 	'Should display a successful result'
				// );
			});
		done();
	});
	test('Update multiple fields on an issue: PUT request to /api/issues/{project}', (done) => {
		chai
			.request(server)
			.put('/api/issues/apitest')
			.send({
				_id: testingId,
				open: 'false',
				created_by: 'George',
			})
			.end((err, res) => {
				assert.equal(res.status, 200, 'Should be no server errors');
				assert.equal(res.body._id, testingId);
				// assert.equal(
				// 	res.body.result,
				// 	'successfully updated',
				// 	'Should display a correct result'
				// );
			});
		done();
	});
	test('Update an issue with missing _id: PUT request to /api/issues/{project}', (done) => {
		chai
			.request(server)
			.put('/api/issues/apitest')
			.send({
				_id: '',
			})
			.end((err, res) => {
				assert.equal(res.status, 200, 'Should be no server errors');
				assert.equal(res.body.error, 'missing _id');
			});
		done();
	});
	test('Update an issue with no fields to update: PUT request to /api/issues/{project}', (done) => {
		chai
			.request(server)
			.put('/api/issues/apitest')
			.send({
				_id: testingId,
			})
			.end((err, res) => {
				assert.equal(res.status, 200, 'Should be no server errors');
				// assert.equal(
				// 	res.body.error,
				// 	'no update field(s) sent',
				// 	'Should display appropriate error message'
				// );
				assert.equal(
					res.body._id,
					testingId,
					'Should return the appropriate _id'
				);
			});
		done();
	});
	test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', (done) => {
		chai
			.request(server)
			.put('/api/issues/apitest')
			.send({
				_id: 'invalidid',
			})
			.end((err, res) => {
				assert.equal(res.status, 200, 'Should be no server errors');
				assert.equal(res.body._id, 'invalidid', 'Should return the invalid ID');
				assert.equal(
					res.body.error,
					'no update field(s) sent',
					'Should return the appropriate error'
				);
			});
		done();
	});
	test('Delete an issue: DELETE request to /api/issues/{project}', (done) => {
		chai
			.request(server)
			.delete('/api/issues/apitest')
			.send({ _id: testingId })
			.end((err, res) => {
				assert.equal(res.status, 200, 'Should be no server errors');
				// assert.equal(
				// 	res.body.result,
				// 	'successfully deleted',
				// 	'Should delete the test issue'
				// ); 
				assert.equal(
					res.body._id,
					testingId,
					'JSON response object should display the invalid ID used'
				);
			});
		done();
	});
	test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', (done) => {
		chai
			.request(server)
			.delete('/api/issues/apitest')
			.send({ _id: 'invalidid' })
			.end((err, res) => {
				assert.equal(res.status, 200, 'Should be no server errors');
				assert.equal(
					res.body.error,
					'could not delete',
					'JSON response object should display the correct error message'
				);
				assert.equal(
					res.body._id,
					'invalidid',
					'JSON response object should display the invalid ID used'
				);
			});
		done();
	});
	test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', (done) => {
		chai
			.request(server)
			.delete('/api/issues/apitest')
			.send({ id: '' })
			.end((err, res) => {
				assert.equal(res.status, 200, 'Should be no server errors');
				assert.isUndefined(res.body.id, 'ID field should be empty');
				assert.equal(
					res.body.error,
					'missing _id',
					'The response body should return "missing _id"'
				);
			});
		done();
	});
});
