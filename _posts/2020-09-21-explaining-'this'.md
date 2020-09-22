---
layout: post
title: "Explaining 'This'"
---

## JavaScript is complicated.

In JavaScript, the ***'this'*** keyword refers to the object which is *executing the current piece of JS code*, or has a *reference to its current execution context*.

The following code provides a basic example of using the keyword 'this' in a JS environment:
```
function name() {
    console.log(this.name);
}

name = "Connor"
obj1 = {name: "Aidan", name: name};
obj2 = {name: "Chris", name: name};

name();
obj1.name();
obj2.name();
```

When run, the code outputs the following:
```
Connor
Aidan
Chris
```

The first call to *name()* calls *this.name* in the name function, which was defined as a **global variable** for the code snippet. The following two calls are executing from the object call (*inside their execution state*) and therefore use those local 'this' values.

### Implicit Binding

Implicit Binding occurs during an execution state call, i.e. when an object or specific element is called with a function, that becomes the current 'this' state.

So, the calls in the previous code with obj1 and obj2 are examples of implicit binding.

### Explicit Binding

Explicit Binding occurs when functions such as *call* or *apply* are used, wherein their first parameter becomes the execution context, binding *'this'*.

```
var name = function() {
    console.log(this.name);
}

var name = "Connor";
var obj1 = {name: "Aidan"};
var obj2 = {name; "Chris"};

var nameCall = name;
name = function() {
    nameCall.call(obj1);
};

name();
name.call(obj2);
```

In this code snipped, both the calls to name() and name.call() will print the value in obj1. Since we call obj1 in every instance of the name function, that will always be the current execution context. Explicitly defining the execution context for every instance of a function is known as ***fixed binding***.

### The ***new*** function call

When the ***new*** keyword is called on a function, it becomes a constructor call wherein:
1. A new empty object is created
2. New object is linked to the prototype property of that function.
3. New object gets bound as ***this*** keyword for execution context of that function call.
4. If that function does not return anything it implicitly returns the ***this*** object.

In the following code snipped from (codeburst.io)[https://codeburst.io/all-about-this-and-new-keywords-in-javascript-38039f71780c]:

```
function bike() {
  var name = "Ninja";
  this.maker = "Kawasaki";
  console.log(this.name + " " + maker);  // undefined Bajaj
}

var name = "Pulsar";
var maker = "Bajaj";

obj = new bike();
console.log(obj.maker);                  // "Kawasaki"
```

We can see that the current execution context is important, as when the new bike object is created, it has empty values, returning an undefined this.name as no value was defined in the current execution state, but prints the maker as that was defined as a global variable, not a ***this*** variable.