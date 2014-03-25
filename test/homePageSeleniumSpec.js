var webdriver = require('browserstack-webdriver');
var testing = require('browserstack-webdriver/testing');
var browserstackUser = 'PaulDAmbra';
var browserstackKey = 'htB4cLkRURykYxVQiSVN';
var fs = require('fs');

webdriver.WebDriver.prototype.saveScreenshot = function(filename) {
    return this.takeScreenshot().then(function(data) {
        fs.writeFile(filename,
                    data.replace(/^data:image\/png;base64,/,''),
                                'base64', function(err) {
                                              if(err) throw err;
                                          });
    });
};

function getDesktopBrowserCapabilities(opts) {
	var options = opts || {};
	return {
		'browser' : options.browser || 'Chrome',
		'browser_version' : options.browserVersion || '33.0',
		'os' : options.os || 'Windows',
		'os_version' : options.osVersion || '7',
		'resolution' : options.resolution || '1280x1024',
		'browserstack.debug' : options.debug || true,
		'browserstack.user' : browserstackUser,
		'browserstack.key' : browserstackKey
	};
}

function getMobileBrowserCapabilities(opts) {
	var options = opts || {};
	return {
		'browserName' : options.browser || 'iPhone',
		'platform' : options.platform || 'MAC',
		'device' : options.device || 'iPhone 5',
		'browserstack.debug' : options.debug || true,
		'browserstack.user' : BrowserStackUser,
		'browserstack.key' : BrowserStackKey
	};
}

testing.describe('Omniclopse Home', function() {
	var driver;
	var server;

	testing.before(function() {
		var capabilities = getDesktopBrowserCapabilities();

		driver = new webdriver
			.Builder()
			.usingServer('http://hub.browserstack.com/wd/hub')
			.withCapabilities(capabilities)
			.build();
	});
  
	testing.it('should have a single carousel', function() {
		driver.get('http://omniclopse-v0-1.herokuapp.com/');
		//driver.saveScreenshot('screenshots/home/homePage.png');

		driver.wait(function() {
			return driver.isElementPresent(webdriver.By.id('homeCarousel')) === true;
		}, 1000);
	});

	testing.after(function() { driver.quit(); });
});