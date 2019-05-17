Primerpedia
===========

[![issues][issues-img]][issues-url]
[![license][license-img]][license-url]

[issues-url]: https://github.com/waldyrious/primerpedia/issues
[issues-img]: http://img.shields.io/github/issues/waldyrious/primerpedia.svg
[license-url]: https://github.com/waldyrious/primerpedia/blob/master/LICENSE.md
[license-img]: https://img.shields.io/github/license/waldyrious/primerpedia.svg

Primerpedia is a proof-of-concept demo for the
[Concise Wikipedia](http://meta.wikimedia.org/wiki/Concise_Wikipedia) proposal.
It provides short summaries of Wikipedia articles,
for when you just need a quick overview at the topic.
Try the live demo here: **https://tools-static.wmflabs.org/primerpedia**

To achieve this, it uses the MediaWiki API to fetch the first section of an article,
and cleans it up for presentation, removing extra details and editing-related templates
(currently using the cleanup procedure implemented by the
[MobileFrontend extension](https://www.mediawiki.org/wiki/Extension:MobileFrontend#prop.3Dextracts)).

This tool should also help identify issues with the lead sections of Wikipedia articles,
which, according to the [Manual of Style](https://en.wikipedia.org/wiki/MOS:LEAD),
"should define the topic and summarize the body of the article with appropriate weight."
