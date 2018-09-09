'use strict';

const should = require('should')
const cheerio = require('cheerio');
const rules = require('../lib/rules')

describe('rule_tag_without_attr', () => {
  it('0 <img> tag without alt attribute', done => {
    var $ = cheerio.load('<img alt="..."/>');
    var ret = rules.rule_tag_without_attr($, console, 'img', 'alt');
    ret.should.equal(0);
    done();
  })

  it('1 <img> tag without alt attribute', done => {
    var $ = cheerio.load('<img/>');
    var ret = rules.rule_tag_without_attr($, console, 'img', 'alt');
    ret.should.equal(1);
    done();
  })

  it('3 <a> tag without alt attribute', done => {
    var $ = cheerio.load('<a/><a/><a/>');
    var ret = rules.rule_tag_without_attr($, console, 'a', 'alt');
    ret.should.equal(3);
    done();
  })

  it('2 <a> tag without alt attribute', done => {
    var $ = cheerio.load('<a/><a alt="..."/><a/>');
    var ret = rules.rule_tag_without_attr($, console, 'a', 'alt');
    ret.should.equal(2);
    done();
  })
})


describe('rule_head_title', () => {
  it('This HTML without <title> tag', done => {
    var $ = cheerio.load('<html><body><title>hello world</title></body></html>');
    var ret = rules.rule_head_title($, console);
    ret.should.equal(false);
    done();
  })

  it('This HTML with <title> tag', done => {
    var $ = cheerio.load('<html><title>hello world</title><body/></html>');
    var ret = rules.rule_head_title($, console);
    ret.should.equal(true);
    done();
  })
})

describe('rule_head_meta_with_name', () => {
  it('0 <meta> tag with attribute name as hello', done => {
    var $ = cheerio.load('<meta/>');
    var ret = rules.rule_head_meta_with_name($, console, 'hello');
    ret.should.equal(0);
    done();
  })

  it('2 <meta> tag with attribute name as hello', done => {
    var $ = cheerio.load('<meta name="hello"/><meta name="test"/><meta/><meta name="hello"/>');
    var ret = rules.rule_head_meta_with_name($, console, 'hello');
    ret.should.equal(2);
    done();
  })
})

describe('rule_more_than_count', () => {
  it('0 <meta> tag with attribute name as hello', done => {
    var $ = cheerio.load('<meta/>');
    var ret = rules.rule_head_meta_with_name($, console, 'hello');
    ret.should.equal(0);
    done();
  })

  it('0 <meta> tag with attribute name as hello', done => {
    var $ = cheerio.load('<meta name="hello"/>');
    var ret = rules.rule_head_meta_with_name($, console, 'hello');
    ret.should.equal(1);
    done();
  })

})
