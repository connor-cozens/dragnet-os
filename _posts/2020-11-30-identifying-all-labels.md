---
layout: post
title: "Progress Update 2"
excerpt_separator: <!--more-->
---

## Identifying All Labels

Since the last progress update, the major change that has been made is that the code no longer operates statically, and works dynamically to detect and select labels based on an identifying character, rather than a hard-coded element ID. Once all the labels with the identifier have been selected, the identifier character is removed from the labels to show just the label text. <!--more-->

## Updating DIV Container

An important thing realized from exporting an SVG diagram directly from diagrams.net is that, unlike the map svg I had previously been working on, all of the text elements for each of the labels were stored inside individual DIV objects which stored the text also as ```innerHTML``` and ```outerHTML``` components. This meant that when the choice objects were created from the labels, the ```Text``` element would be selected to check for the identifier, but then the ```DIV``` would have to be manipulated to show the change on the diagram. Though this was difficult to determine, it allowed the ```innerHTML``` to continue to hold the value of the label, but the ```outerHTML```, which displayed the text, to be changed to the underline to show that the space was a slot, and labels could be dropped on it.

## Creating Label Container

There have been a few different ideas of where to store the labels once they are extracted from the diagram, such as extending the size of the image or the viewbox of the SVG to make room for the labels. After attempting to implement this, I found there were many issues with the scale changing when the image was extended, causing the draggable labels to move at different speeds than the user's mouse as the ratio of the image would be modified.

Then, the idea was to have each user manually draw and create a box on their diagram to house the labels, and identifying that by having the user put a text box at the top of the box to identify it to the program. However, this could have many issues, as the user may not be able to tell how big to create the box, and have to remake it manually until all the labels dynamically-created fit inside the right size box.

Eventually, the current idea is to use dynamic SVG UI Components, shown [here](https://css-tricks.com/creating-ui-components-in-svg/) to create a box that increases in size depending on the number of labels added to it.

## Creating a Reset Button

Not implemented yet, but a button has been added which will eventually be connected to allow a user to reset the state of their diagram to remove all labels from slots, and reset their progress to try the problem again.

## Some Current Existing Issues

Some issues that still exist and need to be fixed now include:
- When an incorrect label is dropped onto a slot, the wrong DIV updates to remove the underline showing an available slot. The change needs to match the label being dropped, not the label that should go in that slot.
- The identifier can currently be at any place in the labels, at the front, at the end, or anywhere in the middle. The condition should be changed so that the identifier needs to be at both the front and end, or clarify conditions for labels.
- Using the same SVG UI Components above, it could be beneficial for a user to manually select which diagram they want to upload to create their draggable workbook problem, again shown [here](https://css-tricks.com/creating-ui-components-in-svg/).