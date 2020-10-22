---
layout: post
title: "Progress Update 1"
---

# Progress to Date: Mid-October

## Learning JavaScript

### Coding and Debugging in JS

Starting this project, I was highly unfamiliar with how to debug both HTML/CSS code and JS scripts. The difference from working in self-contained IDE's and being able to print to consoles, make changes, and just print out to see what was different didn't work for this project. This was especially the case when working with code that relied on browser load times, such as figuring out that a script wasn't running as it was being called before the relevant image was loaded onto the page.

This was a major point that I learned about working in a web environment, as different multimedia can take different times to load, render, etc. it is important to locate these different bottleneck points to determine which elements have to be loaded before other scripts can be called.

After having many issues with working with built-in debugging tools in VS Code, the best way I found to work through testing and debugging was to have the code working on an integrated terminal copy of Jekyll, calling ```jekyll serve``` and navigating to the ```localhost:port``` that it was on, and using the built-in debugging tools in Chrome. Adding breakpoints to know what scripts and functions were being called at different parts of the code, analyzing different interactions and transformations step by step, etc.

### Working with 'this' calls in a non-OO language

Link to blog post about working with 'this' object.

### 

## About SVG Files

### Limitations of ```<SVG>``` Tags

With the original code in the dragnet repository, the SVG image for the map was hardcoded into the index.html file surrounded in ```<SVG> ... </SVG>``` tags. This allowed the SVG object to be interacted with by other HTML, CSS, and JavaScript functions. However, once this code was taken out and put into a standalone SVG files, it became much harder to access the internal information of the file.

When initially importing the SVG back into the index.html file, the first attempt was to import it using ```<SVG>``` or ```<img>``` tags again. This loaded in the image, and was displayed on the browser when the files would work, but the scripts and code that I would try to manipulate the image with wouldn't work. Upon further research, I found that in a web environment, both of these types of tags would import the SVG file as a standalone image, converting it into an efficient format for displaying and viewing, but flattened all of the internal tags, disallowing any sort of manipulation or editing of the file.

### ```<Object>``` Tags and Considerations

This led down a trail of research, and the best alternative was to use ```<object>``` tags in order to import and host the SVG element back in the index.html file.

### Viewsize Relativity

## Dragnet Code & Approaches

### Moving Text Objects