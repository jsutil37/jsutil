# jsutil
js utility functions

https://jsutil37.github.io/jsutil

# How to use:
In your html file, do the following at the start of the file:
```html
<script>
var urlOfUtilDotJs = 'https://jsutil37.github.io/jsutil/util.js'

//workaround for import.meta not being supported by firefox
window.absPathOfUtilDotJs = 
		new URL(urlOfUtilDotJs,window.location.href).href
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
- Support functions for custom Tags for custom components as allowed by the HTML spec
