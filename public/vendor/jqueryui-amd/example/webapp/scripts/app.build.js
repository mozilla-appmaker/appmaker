({
    appDir: "../",
    baseUrl: "scripts",
    dir: "../../webapp-build",
    //Comment out the optimize line if you want
    //the code minified by Closure Compiler using
    //the "simple" optimizations mode
    optimize: "none",

    paths: {
        "jqueryui": "jquery-ui-1.8.21/jqueryui"
    },

    modules: [
        {
            name: "main"
        }
    ]
})
