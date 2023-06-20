const { Builder, By, Key, until } = require('selenium-webdriver');
var DetectLanguage = require('detectlanguage');

var detectlanguage = new DetectLanguage('3500f27f2b59cd4a200436582cd889a4');

async function detection(text){
  let res = await detectlanguage.detect(text).then(function(result) {
    return result[0].language;
  });
  return res;
}
(async function () {

    // Set Chrome driver path
    var driver = await new Builder().forBrowser("chrome").build();
    let StandardXpath = `//span[contains(text(),'{?}')]/parent::*/parent::*/parent::*/following-sibling::div//{?}`;

    // Open URL
    await driver.get('https://forms.gle/9rAg4YKtNUh6CPB26');
    await driver.manage().window().maximize();

    // wait for one second, until page gets fully loaded
    await driver.sleep(1000);

    //code for successful submission of the form.
    try {
        await fillData(driver, StandardXpath);
        await driver.sleep(2000);
        await driver.findElement(By.xpath("//span[contains(text(),'Submit')]")).click();
        let successMsg = await driver.findElement(By.xpath("//div[contains(text(),'Thanks for submitting your contact info!')]")).isDisplayed();
        if (successMsg) {
            console.log("Form submitted successfully. ");
        } else {
            console.log("submission -> FAILURE");
        }
    } catch (error) {
        console.error(error);
    } finally {
        await driver.findElement(By.xpath("//a[contains(text(),'Submit another response')]")).click();
    }

    // //click on send another response and verify if clear button is working.
    try {
        await fillData(driver, StandardXpath);
        let NameText = await driver.findElement(By.xpath(buildFormat(StandardXpath, ['Name', 'input']))).getAttribute('value');
        let emailText = await driver.findElement(By.xpath(buildFormat(StandardXpath, ['Email', 'input']))).getAttribute('value');
        let addressText = await driver.findElement(By.xpath(buildFormat(StandardXpath, ['Address', 'textarea']))).getAttribute('value');
        let phoneNumber = await driver.findElement(By.xpath(buildFormat(StandardXpath, ['Phone number', 'input']))).getAttribute('value');
        let comments = await driver.findElement(By.xpath(buildFormat(StandardXpath, ['Comments', 'textarea']))).getAttribute('value');

        if (NameText === "MyName" && emailText === "myemail@gmail.com" && addressText === "my address" && phoneNumber === "1234567891" && comments === "No comments") {
            console.log("The Data is filled");
        }
        await driver.findElement(By.xpath("//span[contains(text(),'Clear form')]")).click();
        await driver.sleep(2000);
        await driver.findElement(By.xpath("(//div[@role='alertdialog']//span[contains(text(),'Clear form')])[2]")).click();
        await driver.sleep(2000);

        NameText = await driver.findElement(By.xpath(buildFormat(StandardXpath, ['Name', 'input']))).getAttribute('value');
        emailText = await driver.findElement(By.xpath(buildFormat(StandardXpath, ['Email', 'input']))).getAttribute('value');
        addressText = await driver.findElement(By.xpath(buildFormat(StandardXpath, ['Address', 'textarea']))).getAttribute('value');
        phoneNumber = await driver.findElement(By.xpath(buildFormat(StandardXpath, ['Phone number', 'input']))).getAttribute('value');
        comments = await driver.findElement(By.xpath(buildFormat(StandardXpath, ['Comments', 'textarea']))).getAttribute('value');

        if (NameText === '' && emailText === '' && addressText === '' && phoneNumber === '' && comments === '') {
            console.log("The Data is cleared");
        }
    } catch (error) {
        console.error(error);
    }

    // //click on send button to verify if the required field check is working.
    try {
        await driver.findElement(By.xpath(buildFormat(StandardXpath, ['Name', 'input']))).click();
        await driver.findElement(By.xpath(buildFormat(StandardXpath, ['Email', 'input']))).click();
        await driver.findElement(By.xpath(buildFormat(StandardXpath, ['Address', 'textarea']))).click();
        await driver.findElement(By.xpath("//span[contains(text(),'Submit')]")).click();
        await driver.sleep(2000);
        const alertOccurences = await driver.findElements(By.xpath("//div[@role='alert']/span"));
        if (alertOccurences.length === 3 && await driver.findElement(By.xpath("(//div[@role='alert']/span)[1]")).getText() === "This is a required question") {
            console.log("SUCCESS -> field check");
        } else {
            console.log("FAILURE -> field check");
        }
    } catch (error) {
        console.error(error);
    }

    //check the email format check is working.
    try {
        await driver.findElement(By.xpath(buildFormat(StandardXpath, ['Email', 'input']))).sendKeys("myemail@gmail.com@email.com");
        await driver.findElement(By.xpath(buildFormat(StandardXpath, ['Address', 'textarea']))).click();
        let Emailalert = await driver.findElement(By.xpath("(//div[@role='alert']/span)[2]")).getText();
        await driver.sleep(2000);
        if (Emailalert === "Please enter a valid email address") {
            console.log("SUCCESS -> Email validation");
        }
        else {
            console.log("FAILURE -> Email validation");
        }
    } catch (e) {
        console.error(e);
    }

    await driver.sleep(2000);

    await driver.quit();

    var driver = await new Builder().forBrowser("chrome").build();

        // Open URL
        await driver.get('https://forms.gle/VXUe7J4tdmGrQmRf8');
        await driver.manage().window().maximize();

        // wait for one second, until page gets fully loaded
        await driver.sleep(1000);
        let inputs = await driver.findElements(By.xpath("//input[@type='text']|//input[@type='email']"));
        let textArea = await driver.findElements(By.xpath("//textarea"));

        try{
          inputs[0].sendKeys("नाम");
          inputs[1].sendKeys("myemail@gmail.com");
          inputs[2].sendKeys("पता");
          textArea[0].sendKeys("9844087654");
          textArea[1].sendKeys("आप कैसे हैं");
          await driver.sleep(2000);
          await driver.findElement(By.xpath("//span[contains(text(),'Submit')]")).click();
          let successMessage = await driver.findElement(By.xpath("/html/body/div[1]/div[2]/div[1]/div/div[3]")).getText();
          if(await detection(successMessage) === "hi") {
            console.log("Hindi language detected");
          }
          else {
            console.log("Other language detected");
          }

        }catch(error){
          console.error(error);
        }finally {
           await driver.findElement(By.xpath("//a[contains(text(),'Submit another response')]")).click();
        }

        try{
              console.log("Submitting another response")
              let inputs = await driver.findElements(By.xpath("//input[@type='text']|//input[@type='email']"));
              let textArea = await driver.findElements(By.xpath("//textarea"));
              inputs[0].sendKeys("Name");
              inputs[1].sendKeys("myemail@gmail");
              inputs[2].sendKeys("Address");
              textArea[0].sendKeys("9876543232");
              textArea[1].sendKeys("Comment");
              await driver.sleep(2000);
              inputs = await driver.findElements(By.xpath("//input[@type='text']|//input[@type='email']"));
              let inputName = await inputs[0].getAttribute('value');
              if(await detection(inputName) === "hi") {
                console.log("Name field is filled in hindi");
              }
              else {
                console.log("Name field is not filled in hindi");
              }
              textArea = await driver.findElements(By.xpath("//textarea"));
              await textArea[0].click();
              let emailAlert = await driver.findElement(By.xpath("(//div[@role='alert']/span)[1]")).getText();
              await driver.sleep(2000);
              if (emailAlert === "कृपया एक मान्य ईमेल पता प्रविष्ट करें") {
                console.log("SUCCESS -> Email validation");
              }
              else {
                console.log("FAILURE -> Email validation");
              }
              let inputAddress = await inputs[2].getAttribute('value');
              if(await detection(inputName) === "hi") {
                console.log("Address is filled in hindi");
              }
              else {
                console.log("Address is not filled in hindi");
              }
        }catch(error){
            console.error(error);
        }
        await driver.quit();

})();

//function to build the format
function buildFormat(xpath, elements) {
    let index = 0;
    let path = xpath.replace(/{\?}/g, () => elements[index++]);
    return path;
}

//function to build the fillData
async function fillData(driver, StandardXpath) {
    await driver.findElement(By.xpath(buildFormat(StandardXpath, ['Name', 'input']))).sendKeys('MyName');
    await driver.findElement(By.xpath(buildFormat(StandardXpath, ['Email', 'input']))).sendKeys("myemail@gmail.com");
    await driver.findElement(By.xpath(buildFormat(StandardXpath, ['Address', 'textarea']))).sendKeys("my address");
    await driver.findElement(By.xpath(buildFormat(StandardXpath, ['Phone number', 'input']))).sendKeys("1234567891");
    await driver.findElement(By.xpath(buildFormat(StandardXpath, ['Comments', 'textarea']))).sendKeys("No comments");
}
