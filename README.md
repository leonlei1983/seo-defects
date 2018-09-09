A Node Module for Search engine optimization (SEO) defects
===

Installation
---

To install module from github
```sh
yarn add https://github.com/leonlei1983/seo-defects
```

Example
---

```js
var fs = require('fs');
var seodefects = require('seo-defects');

// User is free to chain any rules by themselves
seodefects.setDefaultRule(2, 1, 5);

// User can define and use their own rules easily
function rule_user_defined($, logger) {
  let tag = 'link';
  let tag_cnt = $('link').length;
  logger.log('There are %d <%s> tag without alt attribute', tag_cnt, tag)
}
seodefects.addRule(rule_user_defined)

// Your package should be flexible. e.g. <meta name="robots" />
seodefects.addRule(seodefects.rules.rule_head_meta_with_name, 'robots')

// start to scan
seodefects.setLogger('access.log', stdout=true);

// The input can be
// I. A HTML file
seodefects.scan('./test.html');
// II. Node Readable Stream
// seodefects.scan(fs.createReadStream('./test.html'));
```
