'use strict';

// include modules
const fs = require('fs');
const cheerio = require('cheerio');
const util = require('util');
const stream = require('stream');
const Writable = stream.Writable ||
  require('readable-stream').Writable;

function SEOStream(options) {
  Writable.call(this, options);
}
util.inherits(SEOStream, Writable);

// module export and create instance
module.exports = new SEODefects();

function SEODefects() {
  // private variable
  var nodeStream = new SEOStream();
  var logger = new console.Console(nodeStream, nodeStream);

  // public variable
  this.rule_ids = new Set([1, 2, 3, 4, 5]);
  this.user_defined_rules = new Set();
  this.rules = require('./rules');

  // public function
  this.setLogger = function(file, stdout=true, stream=true) {
    var log_file = file != undefined && file != null;

    if (log_file) {
      var fileStream = fs.createWriteStream(file, { flags: 'a' });
      var fileLogger = new console.Console(fileStream, fileStream);
    }

    var logger_log = logger.log;
    logger.log = function() {
      if (stream) logger_log.apply(logger_log, arguments);
      if (stdout) console.log.apply(console.log, arguments);
      if (log_file) fileLogger.log.apply(fileLogger.log, arguments);
    }
  }

  this.setDefaultRule = function() {
    var rule_ids = Array.from(arguments).filter(id => typeof id == 'number');;
    if (rule_ids.length > 0) {
      this.rule_ids = new Set(rule_ids);
    }
  }

  this.addRule = function() {
    if (arguments.length < 1) return;
    this.user_defined_rules.add(Array.from(arguments));
  }

  this.scan = function(html_object) {
    this.setDefaultRule();
    var seo_rules = new Set();

    var addSEORule = function() {
      if (arguments.length < 1) return;
      seo_rules.add(Array.from(arguments));
    }

    // setup seo rules
    for (let rule_id of this.rule_ids) {
      switch(rule_id) {
        case 1:
          addSEORule(this.rules.rule_tag_without_attr, 'img');
          break;
        case 2:
          addSEORule(this.rules.rule_tag_without_attr, 'a');
          break;
        case 3:
          addSEORule(this.rules.rule_head_title);
          addSEORule(this.rules.rule_head_meta_with_name, 'descriptions');
          addSEORule(this.rules.rule_head_meta_with_name, 'keywords');
          break;
        case 4:
          addSEORule(this.rules.rule_more_than_count, 'strong', 15);
          break;
        case 5:
          addSEORule(this.rules.rule_more_than_count, 'h1', 1);
          break;
      }
    }
    // union user defined rules
    for (let elem of this.user_defined_rules) {
      seo_rules.add(elem);
    }

    // parse and execute SEO defects
    if (html_object instanceof stream.Readable) {
      var readStream = html_object;
    } else {
      let stats = fs.lstatSync(html_object);
      if (stats.isFile()) {
        var readStream = fs.createReadStream('./test.html');
      } else {
        logger.err('unknown source, please provide a readStream or html file path');
        return;
      }
    }

    // read file content
    var chunks = [];
    readStream.on("data", function(chunk) {
      chunks.push(chunk);
    });
    
    readStream.on("end", function() {
      var $ = cheerio.load(Buffer.concat(chunks).toString());
  
      for (let rule_obj of seo_rules) {
        let func = rule_obj[0];
        let func_argv = rule_obj.slice(1, rule_obj.length + 1);
        func_argv.unshift(logger)
        func_argv.unshift($)
        func.apply(this, func_argv);
      }
    });

    return nodeStream;
  }
}


