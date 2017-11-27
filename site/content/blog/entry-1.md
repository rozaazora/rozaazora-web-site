---
title: entry 1
subtitle: subtitle 1
date: 2017-11-27T10:34:04.410Z
description: lorem insplur dol sit amet
image: /images/uploads/propose.jpg
---
For those more used to WordPress, these are the equivalent of includes: files that contain specific layouts or code to be pulled into a larger template. A header, footer and sidebar are all prime examples.

To pull one into a template, you use:

I was left scratching my head for a while before realising I was missing that trailing dot (full stop/period). My variables weren’t working, even the global ones. The reason is you need to pass the variables to the partial template. The dot passes everything in the current context so it’s *very*important.

There’s also the option of using [.Render](http://gohugo.io/templates/functions/#render) on list views, though I have no idea why there’s two approaches, just make everyone use partials (which is what I ended up doing).
