'use strict';

var client = require('../cassandra');

module.exports = {
  getviz: getVisualization
};

function getVisualization(req, res) {
  var id = req.swagger.params.id.value;
  var period = req.swagger.params.period.value;
  var unit = req.swagger.params.unit.value;

  var query = 'SELECT * FROM visualizations WHERE id=? AND period=? AND unit=?';
  var hints = ['text', 'text', 'text'];
  var params = [id, period, unit];

  console.log('query:', query);
  console.log('params:', params);

  client.execute(query, params, {hints: hints}, function(err, result) {
    console.log('response:', err, result);

    if (err) {
      req.status(400);
      req.json({ error: err });
      console.error(err);
      return;
    }

    if (!result || !result.rows[0]) {
      res.status(404);
      res.json({error: 'Not Found'});
      res.end();
      return;
    }

    var row = result.rows[0];
    for (var i = 0; i < row.data.length; i++) {
      row.data[i] = JSON.parse(row.data[i]);
    }
    res.json(row);
  });
}
