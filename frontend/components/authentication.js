import randomstring from 'randomstring';

import macros from './macros'

// TODO: add check to see if the user is logged in or not: 
// https://developers.facebook.com/docs/reference/javascript
// https://developers.facebook.com/docs/reference/javascript/FB.getLoginStatus

// Eventually, this can be used to get the current user data from the server. 

class Authentication {

  constructor() {

    // If the FB library has already loaded, call the init function.
    if (window.FB) {
      this.initFB();
    }
    else {

      // If the FB library has not loaded, put a function on the global state that the FB library will call when it loads
      window.fbAsyncInit = this.initFB.bind(this);
    }

    this.onSendToMessengerClick = this.onSendToMessengerClick.bind(this);
  }


  initFB() {
    window.FB.init({
      appId            : '1979224428978082',
      autoLogAppEvents : false,
      xfbml            : false,
      version          : 'v2.11',
    });


    window.FB.Event.subscribe('send_to_messenger', this.onSendToMessengerClick);
  }

  getLoginKey() {

    let loginKey = window.localStorage.loginKey;

    // Init the loginKey if it dosen't exist
    if (!loginKey) {
      window.localStorage.loginKey = loginKey = randomstring.generate(100)
    }

    return loginKey;
  }

  onSendToMessengerClick(event) {
      
      if (e.event === 'rendered') {
        macros.log('Plugin was rendered');
      } else if (e.event === 'checkbox') {
        const checkboxState = e.state;
        macros.log(`Checkbox state: ${checkboxState}`);
      } else if (e.event === 'not_you') {
        macros.log("User clicked 'not you'");
      } else if (e.event === 'hidden') {
        macros.log('Plugin was hidden');
      } else if (e.event === 'opt_in') {
        macros.log("Opt in was clicked!", e)

        // When the Send To Messenger button is clicked in development, the webhook is still sent to prod by Facebook
        // In this case, send the data to the development server directly. 
        if (macros.DEV) {
          request.post({
            url: '/webhook', 
            body: {
              "object": "page",
              "entry": [
              {
                  "id": "111111111111111",
                  "time": Date.now(),
                  "messaging": [
                  {
                      "recipient":
                      {
                          "id": "111111111111111"
                      },
                      "timestamp": Date.now(),
                      "sender":
                      {
                          "id": "1397905100304615"
                      },
                      "optin":
                      {
                          "ref": e.ref
                      }
                  }]
              }]
          }
        }
        )

      } else {
        macros.log(e, 'other message');
      }
    }
  }

}


export default new Authentication();