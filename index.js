var fetch = require('node-fetch')
var inquirer = require('inquirer')
var Nightmare = require('nightmare'),
  nightmare = Nightmare({ pollInterval: 50, show: true });

var choices = require('./choices.js')

function postToSlack(message) {
  fetch('https://hooks.slack.com/services/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', 
    {
      method: 'POST',
      body: JSON.stringify({ text: message }),
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

function createDoorDashOrder(restaurantLink) {
  nightmare.goto('https://www.doordash.com/consumer/login/')
    .type('input[name="Email"]', EMAIL)
    .type('input[name="Password"]', PASSWORD)
    .click('#login-form [type="submit"]')
    .wait(5000)
    .goto(restaurantLink)
    .click('[class*="StoreDetails_detailsBtn_"]')
    .wait()
    .click('[class*="MoneyPickerRadio_button_"]:last-child')
    .wait(3000)
    .evaluate(function() {
      document.querySelector('[class*="MoneyPickerRadio_otherInput_"]').value = ''
    })
    .type('[class*="MoneyPickerRadio_otherInput_"]', '12')
    .click('[data-test-id="menu-page-group-order-confirm-btn"]')
    .evaluate(function() {
      console.log('clicked confirm')
    })
    .wait('[class*="MenuPage_groupBanner"]')
    .evaluate(function() {
      console.log('found group banner')
    })
    .click('[class*="MenuPage_groupBanner"] [class*="MenuPage_groupButton"]:last-child')
    .wait('[class*="CopyLink_link"]')
    .evaluate(function() {
      console.log('here')
      return document.querySelector('[class*="CopyLink_link"]').innerText
    })
    .end()
    .then(function(linkText) {
      console.log(linkText)
      // postToSlack('<!here> Lunch -> ' + linkText)
    })
}

inquirer.prompt([
  {
    type: 'list',
    name: 'restaurant',
    message: 'Where do you want to eat?',
    choices: choices,
  }
]).then(function (answers) {
  createDoorDashOrder(answers.restaurant)
});