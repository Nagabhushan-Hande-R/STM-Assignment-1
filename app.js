const { Builder, By, Key, until } = require('selenium-webdriver');

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
        await driver.findElement(By.xpath("//span[contains(text(),'Submit')]")).click();
    } catch (error) {
        console.error(error);
    } finally {
        await driver.findElement(By.xpath("//a[contains(text(),'Submit another response')]")).click();
    }

    // //click on send another response and verify if clear button is working.
    try {
        await fillData(driver, StandardXpath);
        let NameText = await driver.findElement(By.xpath(buildFormat(StandardXpath, ['Name', 'input']))).getAttribute('value');
        let emailText = await driver.findElement(By.xpath(buildFormat(StandardXpath, ['Name', 'input']))).getAttribute('value');

        if (NameText === "MyName" && emailText === "myemail@gmail.com") {
            await console.log("The Data is filled");
        }
        await driver.findElement(By.xpath("//span[contains(text(),'Clear form')]")).click();
        await driver.findElement(By.xpath("(//div[@role='alertdialog']//span[contains(text(),'Clear form')])[2]")).click();
        if (NameText === '' && emailText === '') {
            await console.log("The Data is cleared");
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
        const alertOccurences = await driver.findElements(By.xpath("//div[@role='alert']/span"));
        if (alertOccurences.length === 3 && await driver.findElement(By.xpath("(//div[@role='alert']/span)[1]")).getText() === "This is a required question") {
            await console.log("SUCCESS");
        } else {
            await console.log("FAILURE");
        }
    } catch (error) {
        console.error(error);
    }

    //check the email format check is working.
    try {
        await driver.findElement(By.xpath(buildFormat(StandardXpath, ['Email', 'input']))).sendKeys("myemail@gmail.com@email.com");
        await driver.findElement(By.xpath(buildFormat(StandardXpath, ['Address', 'textarea']))).click();
        let Emailalert = await driver.findElement(By.xpath("(//div[@role='alert']/span)[2]")).getText();
        if (Emailalert === "Please enter a valid email address") {
            await console.log("SUCCESS");
        }
        else {
            await console.log("FAILURE");
        }
    } catch (e) {
        console.error(e);
    }

    await driver.sleep(6000);

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