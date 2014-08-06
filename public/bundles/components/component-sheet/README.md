# Component canvas

##A canvas for drawing and sharing!

### Development!

#### 1. Run the server

```
grunt
```

#### 2. Add a Security Exception

* Load the URL from Step 1 into your browser.
* The browser will complain that the security certificate is not trusted.
* That's okay - add an exception, this will allow the component to work in Appmaker.

###  3. Teach Appmaker where you find your new component

* Go to [Appmaker](https://appmaker-integration.herokuapp.com/designer)/
* Sign in.
* In the menu with your email address, click on 'Add a Component'.
* Specify the URL that Step 1 gives you.

### 4. Edit the Component

As the component files are changed, the local server will udpate; Refresh the designer to make it load the new version. (we hope to streamline this later).

[Learn how Components Work](https://github.com/mozilla-appmaker/appmaker/wiki/How-Components-are-Built)

### 5. Use Grunt Lint to catch Errors

To catch errors in your component code, run the following command on the command line in your component folder...

```
grunt lint
```

It will identify syntax errors in your component and help you troubleshoot.
