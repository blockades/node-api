'use strict';

var client = require('../cassandra');

module.exports = {
  getblock: getBlock
};

function getBlock(req, res) {
  var id = req.swagger.params.id.value;

  if (id.length === 64) {
    getBlockByHash(req, res, id);
  } else {
    getBlockByHeight(req, res, id);
  }
}

function getBlockByHeight(req, res, height) {
  var query = 'SELECT * FROM blocks WHERE height=?';
  var hints = ['int'];
  var params = [height];

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

function getBlockByHash(req, res, hash) {
  var query = 'SELECT height FROM blocks_by_hash WHERE hash=?';
  var hints = ['text'];
  var params = [hash];

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

    getBlockByHeight(req, res, result.rows[0].height);
  });
}
