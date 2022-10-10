# React App

Populates a table from the local api created via docker. Read /engineer-challange/Readme.md for more details.

## Installation issues:

CORS issue: backend was blocking frontend running on port 3000 from accessing it on port 4000. I solved this by installing the express cors package:
https://www.npmjs.com/package/cors as well as type definitions. This required a complete rebuild of the backend docker image.

Recommendation: set an ENV variable for this test where cors are allowed to all ports for dev environments and maybe set it to true as default.
