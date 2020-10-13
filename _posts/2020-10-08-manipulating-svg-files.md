---
layout: post
title: "Manipulating SVG Files"
---

## The issue with SVG and Object wrappers

After figuring out how to import the SVG as an image through ```<object>``` tags instead of ```<img>``` tags, I was faced with some unexpected issues.

### <img> Tags

Image tags display the image they are importing assuming that the content is just being displayed to the user, and that there won't be any manipulations taking place. Thus, for the purpose of the dragnet app, ```<img>``` tags won't work.

Thus, after researching, I was able to find that ```<object>``` tags were able to create a wrapper for the SVG image, and allow for manipulation.

### <object> Tags

Now, with importing the SVG image through the object tags, they could no longer be directly manipulated based on the image id or tag.

