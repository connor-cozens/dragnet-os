---
layout: post
title: "Project Final Report"
excerpt_separator: <!--more-->
---

## A Project Lifecycle

### Working Concepts before Full Prototypes

One of the most important things I learned throughout the course of this project was to get out of the tunnel vision towards a final goal or product. Starting the project, I was trying to make elements look good, adding styling, and worrying about elements of user interaction before I had any functionality working. Most of these changes would end up being removed or cause issues getting the core components working, and helped me focus on the important components first before moving to the less important ones. <!--more-->

The development of this web app went step by step, first focusing on dragging any element in an SVG, interaction between elements, etc. These components were refine before moving to extracting elements from a custom-coded SVG to learn how to work with dynamic files rather than static ones, and then to work with any SVG based on identifier characters and improving user interaction.

### Developing the Mental Model

With everything mentioned above, the process from the start of the semester to the end of the semester taught me the importance of developing a mental model with the environments and technologies that you are using for a project. Near the beginning, I was struggling to remember concepts within JavaScript, how to work with DOM environments, practices of HTML and more. As I was continuously programming and working with them, my mental model became stronger and I found getting more confident with the programs I was working with. This was especially the case when it came to using debuggers and exploring different elements of code to find different attributes I was looking for.

### User-Centered Design

While I was working on this project, I was concurrently taking a Human-Computer Interaction course which helped shape the development of this project. Being able to take a mindset of focusing on user goals as opposed to what the designer believes that a user would want.

An example of this was late in the project while working with the labels and how users interact with them, I was told that it was difficult to differentiate between labels that were interactable, and those that could be static on the diagram. It was then important to think of what identifiers users would use to know what elements are interactable and which aren't. To do this, I changed the cursor to show the user that they can move the elements, and changed the colors of each label to signify what each one meant - blue for labels that have been locked into place and green for labels that the user can interact with.

## Project Next-Steps

### User Designs & Input

As is right now, the app is hard-coded to use a default diagram that was exported from ![Diagrams.net](https://www.diagrams.net/). The next step to allow users to specifically use this would be to give them different options to choose the image they want to create a graphical exercise with. This could be done through allowing the user to upload their own custom image, but would require additional checks for:
- Proper SVG format and better failure messages and checks
- Methods for collecting errors & sending to development team
- Changing the reset button to do a soft reset of the app rather than a hard reset

### Label Extraction

On some of the final analyses in the scope of the project, one things I noticed was that sometimes text are created as ```<span>``` elements in the vector images as opposed to ```<Text>``` which are not accounted for in the current state of the application. There should be some additional checks done to see if these behave differently, and may require additional coding in order to allow all elements to function correctly.

### Dynamic Label Box

Right now labels are placed in the top right of a given vector image, but if the user has placed any elements in the area the labels are likely to cover and possible interfere with them. In future development this should be changed to a box that is created or added on to the SVG image that will hold the labels to ensure that they don't cover the image and give the application to place them without having to do checks over an entire image before placing the labels.

### App Results Reporting

The application currently reports to the user whether they got every label selection correct, or if they didn't. A future development on the application will be to calculate and check the number of selections a user got correct and report these to the user, and to integrate elements into a reporting tool for something like a university gradebook.