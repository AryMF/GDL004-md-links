module.exports = [
	{
	  href: 'https://es.wikipedia.org/wiki/Markdown',
	  text: 'Markdown',
	  file: 'other/test.md',
	  status: 'Ok',
	  responseCode: 200
	},
	{
	  href: 'https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg',
	  text: 'md-links',
	  file: 'other/test.md',
	  status: 'Ok',
	  responseCode: 200
	},
	{
	  href: 'https://nodejs.org/es/',
	  text: 'Node.js',
	  file: 'other/test.md',
	  status: 'Ok',
	  responseCode: 200
	},
	{
	  href: 'https://arlosazaustre.com/manejando-la-asincronia-en-javascript/',
	  text: 'Asíncronía en js',
	  file: 'other/test.md',
	  status: 'Fail',
	  responseCode: 'FetchError: request to https://arlosazaustre.com/manejando-la-asincronia-en-javascript/ failed, reason: getaddrinfo ENOTFOUND arlosazaustre.com'
	},
	{
	  href: 'https://httpstat.us/201',
	  text: '201',
	  file: 'other/test.md',
	  status: 'Ok',
	  responseCode: 201
	},
	{
	  href: 'https://httpstat.us/202',
	  text: '202',
	  file: 'other/test.md',
	  status: 'Ok',
	  responseCode: 202
	},
	{
	  href: 'https://httpstat.us/300',
	  text: '300',
	  file: 'other/test.md',
	  status: 'Fail',
	  responseCode: 300
	},
	{
	  href: 'https://httpstat.us/308',
	  text: '308',
	  file: 'other/test.md',
	  status: 'Ok',
	  responseCode: 200
	},
	{
	  href: 'https://httpstat.us/400',
	  text: '400',
	  file: 'other/test.md',
	  status: 'Fail',
	  responseCode: 400
	},
	{
	  href: 'https://httpstat.us/403',
	  text: '403',
	  file: 'other/test.md',
	  status: 'Fail',
	  responseCode: 403
	},
	{
	  href: 'https://httpstat.us/404',
	  text: '404',
	  file: 'other/test.md',
	  status: 'Fail',
	  responseCode: 404
	},
	{
	  href: 'https://httpstat.us/418',
	  text: '418',
	  file: 'other/test.md',
	  status: 'Fail',
	  responseCode: 418
	},
	{
	  href: 'https://httpstat.us/503',
	  text: '503',
	  file: 'other/test.md',
	  status: 'Fail',
	  responseCode: 503
	}
]
