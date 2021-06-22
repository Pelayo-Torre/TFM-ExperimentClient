exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: [	'spec.js'  ,  'integration-test.js'],
  jasmineNodeOpts: {
	defaultTimeoutInterval: 5000000
	}
}