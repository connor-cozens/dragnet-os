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

### Working with page load times

As mentioned previously, it is important to let multimedia render completely before calling scripts and attempting to manipulate the files. A specific instance so far is to let the SVG file completely load into the object tag before attempting to call the main.js file on it. To do this, it was important to contain all of the code for manipulating the SVG object within a call to: ```window.addEventListener("load", function() {})``` which adds an event listener onto the overall browser window, with the call to ```"load"``` defining that we want to wait for everything on the page to load before running everything within the curly braces.

### Working with 'this' calls in a non-OO language

Working with JavaScript had some specific intricacies that I was not familiar with. Two of these major points were dealing with calling to 'this' within JS, which I outlined in the post here: {% post_url 2020-09-30-manipulating-'this'-updated %} which goes into more detail. But subsequently, there is an important distinction between the ```=``` operator and the ```=>``` operator for assigning functions which both have important uses and distinctions.

## About SVG Files

### Limitations of ```<SVG>``` Tags

With the original code in the dragnet repository, the SVG image for the map was hardcoded into the index.html file surrounded in ```<SVG> ... </SVG>``` tags. This allowed the SVG object to be interacted with by other HTML, CSS, and JavaScript functions. However, once this code was taken out and put into a standalone SVG files, it became much harder to access the internal information of the file.

When initially importing the SVG back into the index.html file, the first attempt was to import it using ```<SVG>``` or ```<img>``` tags again. This loaded in the image, and was displayed on the browser when the files would work, but the scripts and code that I would try to manipulate the image with wouldn't work. Upon further research, I found that in a web environment, both of these types of tags would import the SVG file as a standalone image, converting it into an efficient format for displaying and viewing, but flattened all of the internal tags, disallowing any sort of manipulation or editing of the file.

### ```<Object>``` Tags and Considerations

This led down a trail of research, and the best alternative was to use ```<object>``` tags in order to import and host the SVG element back in the index.html file. An object tag defined a container for a resource rather than importing the image or resource directly into the page. Using these tags is essential to the functionality of the dragnet application, as we need to be able to read the internal id and tag values within the external SVG file to retrieve their label content, manipulate their CSS, transform them, and use their coordinates to check accuracy for the app.

### So, how do you work with an embedded SVG File?

With working with an inline SVG file, it would be easy to call the svg and get certain elements within it with ```svgobject.getElementByID('Text')```, manipulate it, and have everything react and display automatically within the browser. However, since the SVG object is contained within a wrapper now, we have to manipulate a few different conditions of web-based content documents first. The process to get an object from the SVG file goes as follows:
1. Retrieve the ```<Object>``` wrapped from the HTML ```document``` using a ```.getElementById()``` call.
2. From that variable, you need to retrieve the content from the object, so calling ```.contentDocument``` on the variable to retrieve the SVG file.
3. From here, you can use ```.getElementById()``` to retrieve the different elements you want, use commands such as ```.getAttribute()``` or ```.setAttribute()``` to manipulate and change these elements how you want them, etc.

### Viewsize Relativity

An important concept to read on and understand - _which I haven't fully grasped yet either_ - is manipulating the viewsize and viewbox of the SVG object in question. The benefit of SVG files is that they are vectors, so they are easily scalable to match different browsers, devices, and more. Because of that, when defining and creating SVG files there are many different conventions, notations, and ways to define the size of object, whether that be in nm, mm, px, or relative %. Going into code that I didn't write, I had to look through and understand which values were chosen and why, and how they interacted with different pieces of code.

An issue I encountered recently was once a label was extracted from the SVG and was created, the user could drag it, but each px the user would move would be exaggerated on the image, at about a scale of 1:4. So, when you would drag just a quarter of the screen the object would fly all the way to the other side. This was due to how the OnDrag function was created, and how the viewbox was defined to be a relative size of the page. Thus, for now, most of the code was created just using explicit pixel values to ensure accuracy.

## Dragnet Code & Approaches

### Moving Text Objects

When deciding how to move and place objects, there are multiple different attributes that can be manipulated on an SVG object. The first few ideas I had were to manipulate just the ```x``` and ```y``` values, or to use the ```dx``` and ```dy``` values to change their offset values. The issues with these decisions were that these decisions were also affected by the viewbox, and making specific changes was difficult with relative values. Also, when you would try to edit the text value to change these values, creating the new tag would erase all of the other information beside x and ym like rotation, textLength, etc. and isn't ideal for the manipulation of the objects.

What ended up being a good option was to add a new ```<Transform>``` attribute on to the element to be moved. The transform allow us to change or add to the x and y values of the object, apply rotations, skews, and more without changing the existing code that exists within the tags.