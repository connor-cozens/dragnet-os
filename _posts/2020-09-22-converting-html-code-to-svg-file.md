---
layout: post
title: "Converting HTML code to an SVG File"
excerpt_separator: <!--more-->
---

## Converting the Original HTML Code

This step didn't take too long, the original code that was in the index.html file for the dragnet code had the program that it was created using - inkscape. So, I copied all the SVG code into a new HTML file, imported it into inkscape, and exported it as a proper .SVG file. It contained all of the same values but cleaned up the code and made it easier to read and understand. <!--more-->

## Importing the new SVG file into the index.html file

This is where I struggled the longest with manipulating the SVG files. After doing a bunch of research, there are a few limitations to using SVG files within HTML. You can import an SVG using an  ```<img>``` tag, but it prevents you from manipulating anything within the SVG through CSS, JavaScript, and more. Thus began the slow descent into madness trying to figure this out.

After trying to import again using SVG tags, using a few different view options, I found that using ```<object>``` tags best allowed for the SVG image to be imported and also manipulated. This has proven to be an issue, as most of the existing code implicitly calls the SVG image for manipulations, examples being that the labels are extracted from the SVG code and then appended as children onto the image. The limitation now is that the SVG is already rendered inside the object, so when the choices are appended, the changes are not reflected on the page.

As of now, I'm not sure how to fix it, but a few ideas I'm going to try to implement are:
- Updating/refreshing the object to reflect appended children
- Rendering the image after the labels have been extracted and added to the svg