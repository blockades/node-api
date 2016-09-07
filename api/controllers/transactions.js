'use strict';

var client = require('../cassandra');

module.exports = {
  gettx: getTransaction
};

function getTransaction(req, res) {
  var id = req.swagger.params.id.value;

  var query = 'SELECT * FROM transactions WHERE txid=?';
  var hints = ['text'];
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
      res.end();
      return;
    }

    res.json(result.rows[0]);
  });
}
