var cassandra = require('cassandra-driver');

var hostsNum = parseInt(process.env.CASSANDRA_HOSTS_NUM || '0', 10);
var hosts = [];

if (hostsNum > 0) {
  for (var i = 1; i <= hostsNum; i++) {
    hosts.push(process.env['CASSANDRA_HOST_' + i]);
  }
} else {
  hosts = [
    process.env.CASSANDRA_HOST || 'localhost'
  ];
}

var client = new cassandra.Client({
  contactPoints: hosts,
  keyspace: 'openblockchain'
});

module.exports = client;
