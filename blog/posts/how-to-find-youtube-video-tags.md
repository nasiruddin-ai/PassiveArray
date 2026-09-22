---
title: How to find any YouTube video's tags (free, no extension required)
description: Tags are hidden from viewers but still sit in the page. Three ways to read them, what they are worth, and how to use a competitor's list properly.
date: 2026-09-16
keyword: how to find youtube tags on a video
category: YouTube SEO
tools: youtube-channel-quality-checker, youtube-subscriber-count-checker
---

YouTube stopped showing tags to viewers years ago, but it never stopped sending them to your browser. Every tag a creator set is still in the page you are already looking at. Here are three ways to read them, from fastest to most manual.

## Method 1: view the page source

Works in any browser, costs nothing, needs no software.

1. Open the video page on a desktop browser.
2. Press `Ctrl+U` on Windows or `Cmd+Option+U` on a Mac. This opens the raw page.
3. Press `Ctrl+F` and search for `keywords`.
4. The tags appear as a comma-separated list inside a meta tag.

If the search finds nothing, the video has no tags set. That is common and, as we cover below, not necessarily a mistake.

## Method 2: the Passive Array extension

Our [free Chrome extension](../../youtube-extension/) shows the tags as clickable chips in the sidebar of every watch page, along with the tag count and how much of YouTube's 500-character limit the creator used. Click a tag to search it, or copy the whole list with one button.

It reads the same page data as method 1, so it needs no API key and no account. It also shows the video's engagement rate, views per day and title and description checks in the same panel.

## Method 3: a browser bookmarklet

If you want method 1 without the source view, make a bookmark whose address is this line:

`javascript:(function(){var m=document.querySelector('meta[name=keywords]');alert(m?m.content:'This video has no tags.')})()`

Click it on any watch page and the tags appear in a dialog box. Some browsers strip the `javascript:` prefix when you paste, so type those eleven characters by hand.

## What you should do with a competitor's tags

Less than you think.

Copying a competitor's tag list wholesale is legal and almost useless. Their tags describe their video. YouTube's own documentation says tags play a minimal role in discovery, with one specific exception: they help when your subject is commonly misspelled. Everything else about ranking is driven by the title, the thumbnail, the description, what is actually said in the video, and above all how viewers behave after clicking.

What a competitor's tags are genuinely good for is **vocabulary**. If several ranking videos on a topic all use a phrase you had not thought of, that phrase is what your audience calls the thing. Put it in your title and your first two lines of description, where it will actually do work. That is worth far more than pasting it into your tag box.

For the full picture of what tags do and do not do, see [do YouTube tags still matter](../do-youtube-tags-still-matter/).

## Reading the tag count as a signal

There is one useful signal in the numbers themselves. When you look at the top results for a keyword and several of them have no tags at all, you are looking at a topic where tags are clearly not the deciding factor, and where a competitor is winning on title and retention alone. That tells you where to compete.

Our extension shows the tag count under every search result for exactly this reason, alongside views per day and channel size.

## A sensible tag routine

Five minutes per video, no more:

1. Your main keyword, spelled exactly as people type it.
2. Two to four longer variations of it.
3. Brand or product names in the video, in every spelling people use.
4. One or two broad category terms.
5. Any other language your audience searches in.

Stop around 480 characters so a later edit does not push you over the 500-character limit.

Then spend the time you saved on the title and the first thirty seconds of the video, which is where ranking is actually won.
