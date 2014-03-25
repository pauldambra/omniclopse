module.exports = {
  "Test the home page" : function (browser) {
    browser
      .url("http://omniclopse-v0-1.herokuapp.com/")
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#homeCarousel')
      //must have at least one image
      .assert.elementPresent('#homeCarousel .item img')
      .end();
  }
};