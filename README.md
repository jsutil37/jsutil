# About This Repository
Reusable js utility functions. 
These are not meant to be standard ways of doing things or even the best ways, and may reinvent the wheel.
However they just might get someone up and running quickly.

The code is MIT-licensed, also if anything is found helpful, please link to the appropriate url of this repository and star this repository.
To get in touch, please open an issue with your contact details and we will contact you.

https://jsutil37.github.io/jsutil

# How to use:
In your html file, do the following at the start of the file:
```html
<script>
//workaround for import.meta not being supported by firefox, but may not be needed any more 
var urlOfUtilDotJs = 'https://jsutil37.github.io/jsutil/util.js'
function getPathOfUtilDotJs(){return urlOfUtilDotJs}
</script>
<script type="module">
import * as u from 'https://jsutil37.github.io/jsutil/util.js'
.
.
.
</script>
```

# Main Features
- A variety of resource loading functions: see https://jsutil37.github.io/jsutil/loaderUtil.js
- All code is async and does not use document.write()

# Roadmap
- TODO: use ES6 modules and avoid using the global namespace
- Support functions for custom Tags for custom components as allowed by the HTML spec
