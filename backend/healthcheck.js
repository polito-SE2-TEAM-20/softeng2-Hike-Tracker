/* Simple node.js healthcheck tool.
 *
 * Usage:
 *  node /healthcheck.js HOST PORT PATH CODE
 *
 * e.g.
 *  node /healthcheck.js testhost.my.compoany 3000 / 200
 *
 * Connection always goes to localhost
 *
 */
const http = require('http');

const [host, port, path, code] = process.argv.slice(2);

const options = {
  headers: {
    host,
  },
  host: 'localhost',
  path,
  port,
  timeout: 1000,
};

const request = http.request(options, (res) => {
  console.log('HEALTHCHECK STATUS: ', res.statusCode);
  process.exitCode = res.statusCode === parseInt(code, 10) ? 0 : 1;
  process.exit();
});

request.on('error', (err) => {
  console.error('HEALTHCHECK ERROR', err);
  process.exit(1);
});

request.end();
