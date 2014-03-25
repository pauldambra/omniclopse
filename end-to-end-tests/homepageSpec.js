module.exports = {
  "Test the home page" : function (browser) {
    browser
      .url("http://omniclopse-v0-1.herokuapp.com/")
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('header img#brand')
      .assert.elementPresent('header .navbar')
      .assert.elementPresent('header .navbar li a')
      .assert.elementPresent('.carousel')
      .assert.elementPresent('.carousel .item img')
      .assert.elementPresent('.row.info')
      .assert.elementPresent('.row.info .panel')
      .end();
  }
};