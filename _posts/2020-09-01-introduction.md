---
layout: post
title: "What is Dragnet?"
excerpt_separator: <!--more-->
---

## Dragnet is a continuation of the project located [here][1].

The goal of the project is to create a Javascript Web Application that will extract specified labels from SVG images to create graphical exercises such as fill-in-the-blank and matching problems from images created in PowerPoint, and create an interactable web version where the specified image labels can be moved to their corresponding place. <!--more-->

The app needs to be able to check if the labels are placed back into their correct location, with the ability to grade and give feedback to the user based on how many they placed correct or incorrectly.

For example, the below image shows a map of Canada with three labels that have been extracted and turned into interactable objects that can be dragged and placed onto the map for a word matching problem.

![dragnet map example](/dragnet-os/assets/images/map_example.png)

Below are some important functionality that should be considered as the project is developed.
- Support for multiple language analysis, including right to left language, and top to bottom languages.
    - Important for checking collision of the labels with the image they're on.
- Support for services such as text-to-voice to ensure accessibility of the software both in creation of the graphical exercise as well as usage of the product.
- Integration with existing software used for tracking courses such as Sakai

[1]: https://github.com/iezer/dragnet