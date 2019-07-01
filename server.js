// // Node Server :
// // - Handles routing between lobby and checkers game play
// // - Handles Serving of static UI files
//
// // Dependencies
// // =========================================================
// const path = require("path")
// const express = require("express")
// const bodyParser = require("body-parser")
//
// const app = express();
// const urlEncoderParser = bodyParser.urlencoded({extended:true});
//
// const PORT = process.env.PORT || 3301
//
//
// // Route Settings
// // =========================================================
// // to parse json:
// app.use(bodyParser.json({type: "application/*+json"}))
// app.use(bodyParser.raw({type: "application/vnd.custom.type"}))
// app.use(bodyParser.text({type : "text/html"}))
// app.use(urlEncoderParser);
//
//
//
// // Route Handler
// // =========================================================
// // use to parse json:
// // require("*./ui/routing/apiRoutes.js")(app);
// require("./ui/routing/htmlRoutes.js")(app);
//
//
// //  Listener
// // =========================================================
// // use to parse json:
// app.listen(PORT, () => {
//   console.log("You are listening on PORT ", PORT);
// });
