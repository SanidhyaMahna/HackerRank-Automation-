const puppeteer = require("puppeteer");
let cTab;//current tab
let {email, password} = require("./secrets");
let {answer} = require("./codes");
// console.log(email);
// console.log(password);
// let email = "";
//  let password= "";
//ui-content align-icon-right

let browserOpenPromise = puppeteer.launch({
    headless:false,
    defaultViewport: null,
    args:["--start-maximized"],
    //chrome://version
    //exectualbe path:- 
    //C:\Program Files (x86)\Google\Chrome\Application\chrome.exe
   // executablePath: "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
});

browserOpenPromise
    .then(function(browser){//
        console.log("browser is open");
        let allTabsPromise = browser.pages();//returns an array of all open pages inside browser
        return allTabsPromise;  //
        
    })//this is chaining of promises as this .then is working for returned allTabsPromise 
    .then(function(allTabsArr){
        cTab = allTabsArr[0];
        console.log("new Tab");
        //url to navigate to            //goto will open this website
        let visitingLoginPromise = cTab.goto("https://www.hackerrank.com/auth/login");
        return visitingLoginPromise;
    })
    .then(function () {
        console.log("open hackerrank auth.login page");
                                            //selector(where to type), data(what to type)
        let emailTypePromise = cTab.type("input[name='username']",email);
        return emailTypePromise;
    })
    .then(function() {
        console.log("Email. is typed");
        let passwordTypePromise = cTab.type("input[name='password']",password);
        return passwordTypePromise;

    })

    .then(function() {
        console.log("Password. is typed");

        let willBeLoggedInPromise = cTab.click(
            ".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled"
        );
        return willBeLoggedInPromise;
    })
    .then(function() {
        console.log("we Are logged into HackerRank Successfully");
        // waitAndClick will wait for the selector to load and then it will clicl on the node
       
        let algorithmTabWillBeOpened = waitAndClick(
            "div[data-automation='algorithms']"
        );
        return algorithmTabWillBeOpened;
    })
    
    .then(function() {
        //resolve();

        let allQuesPromise = cTab.waitForSelector('a[data-analytics="ChallengeListChallengeName"]');
        return allQuesPromise;
    })

    .then(function(){
        function getAllQuesLink() {
            let allElemArr = document.querySelectorAll('a[data-analytics="ChallengeListChallengeName"]');
            let linkArr = [];
            for(let i =0; i<allElemArr.length; i++){
                linkArr.push(allElemArr[i].getAttribute("href"));
            }
            return linkArr;
        }
        let linkArrPromise = cTab.evaluate(getAllQuesLink);
        return linkArrPromise;

    })

    .then(function(linkArr){
        console.log("links to all question received");
        //console.log(linkArr);
        //quesiton solve karna h 

        let questionWillBeSolvedPromise = questionSolver(linkArr[0],0);
        return questionWillBeSolvedPromise;
    })
    .then(function(){
        console.log("question is solved");
    })


    .catch(function(err){
        reject(err);
    });

    function waitAndClick(selector) {
        //we make our own promise to delay the process of clicking such that th epage is loaded before clicking
        let myPromise = new Promise(function (resolve, reject){
            let waitForSelectorPromise = cTab.waitForSelector(selector);
            //when promise is fullfilled we use then clickPromise
            waitForSelectorPromise
             .then(function(){
                 //algo button is found (selector)
                 console.log("algo button is found");
                 let clickPromise = cTab.click(selector);
                 return clickPromise;
             })
             .then(function(){
                 console.log("algo button is clicked");
                 resolve();
             })

            .catch(function(err) {
                reject(err);
             })
             
        });
        return myPromise;
        
    }

    function questionSolver(url, idx){
        return new Promise(function (resolve, reject) {
            let fullLink = `https://www.hackerrank.com${url}`;
            let goToQuesPagePromise = cTab.goto(fullLink);

            goToQuesPagePromise
                .then(function() {
                    console.log("question opened");
                    let waitForCheckBoxAndClickPromise = waitAndClick(".checkbox-input");
                    return waitForCheckBoxAndClickPromise;
                })
                .then(function(){
                    let waitFortextBoxPromise = cTab.waitForSelector(".custominput");
                    return waitFortextBoxPromise;
                })
                .then(function(){
                    let codeWillBeTypedPromise = cTab.type(".custominput", answer[idx]);
                    return codeWillBeTypedPromise;
                })
                .then(function(){
                    let controlPresssedPromise = cTab.keyboard.press("Control");
                    return controlPresssedPromise;
                })
                .then(function(){
                    let aKeyPresssedPromise = cTab.keyboard.press("a");
                    return aKeyPresssedPromise;
                })
                .then(function () {
                    let aKeyDownPromise = cTab.keyboard.up("a");
                    return aKeyDownPromise;
                })
                
                
                .then(function(){
                    let xKeyPresssedPromise = cTab.keyboard.press("x");
                    return xKeyPresssedPromise;
                })
                .then(function () {
                    let controlDownPromise = cTab.keyboard.up("Control");
                    return controlDownPromise;
                })
                .then(function () {
                    let xKeyDownPromise = cTab.keyboard.up("x");
                    return xKeyDownPromise;
                })
                
                
                .then(function(){
                    //select the editor
                    let cursorPointToEditorPromise = cTab.click(
                        ".monaco-editor.no-user-select.vs"
                    );
                    return cursorPointToEditorPromise;
                })
                .then(function(){
                    let controlPresssedPromise = cTab.keyboard.press("Control");
                    return controlPresssedPromise;
                })
                .then(function(){
                    let aKeyPresssedPromise = cTab.keyboard.press("a");
                    return aKeyPresssedPromise;
                })
                
                .then(function(){
                    let pasteToEditorPromise = cTab.keyboard.press("v");
                    return pasteToEditorPromise;
                })
                .then(function () {
                    let aKeyDownPromise = cTab.keyboard.up("a");
                    return aKeyDownPromise;
                })
                
                .then(function () {
                    let vKeyDownPromise = cTab.keyboard.up("v");
                    return vKeyDownPromise;
                })
                .then(function () {
                    let controlDownPromise = cTab.keyboard.up("Control");
                    return controlDownPromise;
                })
                

                .then(function () {
                    let submitButtonClickedPromise = cTab.click(".hr-monaco-submit");
                    return submitButtonClickedPromise;
                })
                

                .then(function () {
                    console.log("code submitted successfully");
                    resolve();
                })
            
                .catch(function (err){
                    //console.log(err);
                    reject(err);
                });
        });
        
    }