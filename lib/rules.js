'use strict';

// rule 1 & 2
function rule_tag_without_attr($, logger, tag='img', attr='alt') {
  var invalid_cnt = 0;
  $(tag).each(function() {
    if (undefined == $(this).attr(attr)) {
      invalid_cnt += 1;
    }
  });
  switch(invalid_cnt) {
    case 0:
      break;
    case 1:
      logger.log('There is %d <%s> tag without alt attribute', invalid_cnt, tag);
      break;
    default:
      logger.log('There are %d <%s> tag without alt attribute', invalid_cnt, tag);
      break;
  }
  return invalid_cnt
}

// rule 3
function rule_head_title($, logger) {
  if ($('head title').length < 1) {
    logger.log('This HTML without <title> tag');
    return false;
  }
  return true;
}

function rule_head_meta_with_name($, logger, value) {
  var match_cnt = $('head meta').filter(function() {
    return $(this).attr('name') == value;
  }).length;

  if (match_cnt == 0) {
    logger.log('This HTML without <meta name="%s" .../> tag', value);
  }

  return match_cnt;
}

// rule 4 & 5
function rule_more_than_count($, logger, tag='h1', count=0) {
  if ($(tag).length > count) {
    if (count == 0) {
      logger.log('This HTML have more than one <%s> tag', tag);
    } else {
      logger.log('This HTML have more than %d <%s> tag', count, tag);
    }
  }
}

module.exports = {
  'rule_tag_without_attr': rule_tag_without_attr,
  'rule_head_title': rule_head_title,
  'rule_head_meta_with_name': rule_head_meta_with_name,
  'rule_more_than_count': rule_more_than_count,
}

