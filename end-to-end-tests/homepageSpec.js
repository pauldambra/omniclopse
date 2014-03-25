module.exports = {
  "Test the home page" : function (browser) {
    browser
      .url("http://omniclopse-v0-1.herokuapp.com/")
      .waitForElementVisible('body', 1000)
      //.setValue('input[type=text]', 'nightwatch')
      //.click('button[name=btnG]')
      //.pause(1000)
      //.assert.containsText('#main', 'The Night Watch')
      .assert.elementPresent('#homeCarousel')
      //must have at least one image
      .assert.elementPresent('#homeCarousel .item img')
      .end();
  }
};