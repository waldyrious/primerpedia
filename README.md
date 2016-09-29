Primerpedia
=========

![issues](http://img.shields.io/github/issues/waldyrious/primerpedia.svg)&nbsp;
![license](https://img.shields.io/github/license/waldyrious/primerpedia.svg)

Primerpedia is a proof-of-concept demo for the
[Concise Wikipedia](http://meta.wikimedia.org/wiki/Concise_Wikipedia) proposal.
It provides short summaries of Wikipedia articles,
for when you just need a quick overview at the topic.
Try the live demo here: **http://waldyrious.github.com/primerpedia**

To achieve this, it uses the MediaWiki API to fetch the first section of an article,
and cleans it up for presentation, removing extra details and editing-related templates
(currently using the cleanup procedure implemented by the
[MobileFrontend extension](https://www.mediawiki.org/wiki/Extension:MobileFrontend#prop.3Dextracts)).

This tool should also help identify issues with the lead sections of Wikipedia articles,
which, according to the [Manual of Style](https://en.wikipedia.org/wiki/MOS:LEAD),
"should define the topic and summarize the body of the article with appropriate weight."
