'use strict';

var client = require('../cassandra');

module.exports = {
  getblock: getblock
};

function getblock(req, res) {
  var id = req.swagger.params.id.value;

  var query = 'SELECT * FROM blocks WHERE height=?';
  var hints = ['int'];
  var params = [id];

  console.log('query:', query);
  console.log('params:', params);

  client.execute(query, params, {hints: hints}, function(err, result) {
    console.log('response:', err, result);

    if (err) {
      throw err;
    }

    if (!result || !result.rows[0]) {
      res.status(404);
      res.json({error: 'Not Found'});
      return;
    }

    res.json(result.rows[0]);
  });
}
