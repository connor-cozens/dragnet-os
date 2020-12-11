---
layout: post
title: "Explaining 'This'"
excerpt_separator: <!--more-->
---

## JavaScript is complicated.

In JavaScript, the ***'this'*** keyword refers to the object which is *executing the current piece of JS code*, or has a *reference to its current execution context*. <!--more-->

The following code provides a basic example of using the keyword 'this' in a JS environment:
```
function printname() {
    console.log(this.name);
} 

name = "Connor";
var obj1 = {name: "Aidan", printname: printname};
var obj2 = {name: "Chris", printname: printname};

printname();
obj1.printname();
obj2.printname();
```

When run, the code outputs the following:
```
Connor
Aidan
Chris
```

![printname call](/dragnet-os/assets/images/implicit_binding_global_call.png)

If we trace the first call to ```printname()```, we can see that the function is being called on our global environment. Thus, the local stack is pointing to the global stack. Therefore, the *this* elements of the local space will refer to all of the values that were defined in the original code.

![obj1 call](/dragnet-os/assets/images/implicit_binding_obj1_call.png)

If we trace the second call to ```obj1.printname()```, we can see that the function is being called on the variable created from the obj1 object. Thus, the local stack becomes the values assigned to obj1, ```this.name``` will refer to "Aidan" inside this call, but if you just called ```name``` it would still print *Connor*, as it still exists and can be called as a global variable.

![obj2 call](/dragnet-os/assets/images/implicit_binding_obj2_call.png)

If we trace the third call to ```obj2.printname```, we can see that the function is being called on the variable created from the obj2 object. Thus, the local stack becomes the values assigned to obj2, ```this.name``` will refer to "Chris" inside this call, but if you just called ```name``` it would still print *Connor*, as it still exists and can be called from the global environment.


### Implicit Binding

Implicit Binding occurs during an execution state call, i.e. when an object or specific element is called with a function, that becomes the current 'this' state. This switches to the call or local stack, where global variables can still be accessed, but the values of *this* change.

So, the calls in the previous code with obj1 and obj2 are examples of implicit binding.

### Explicit Binding

Explicit Binding occurs when functions such as *call* or *apply* are used, wherein their first parameter becomes the execution context, binding *'this'*.

```
var printname = function() {
    console.log(this.name);
}

var name = "Connor";
var obj1 = {name: "Aidan"};
var obj2 = {name: "Chris"};

var nameCall = printname;
printname = function() {
    nameCall.call(obj1);
};

printname();
printname.call(obj2);
```

![global call](/dragnet-os/assets/images/explicit_binding_global_call.png)

If we trace the initial call on printname, we can see that ```printname()``` was defined to call obj1 any time that the printname function is called. Thus, even though obj1 is not explicitly called in this statement, the global variable ```name``` is not called, and the name value inside ```obj1``` will be used. Printing out *Aidan*.

![obj2 call](/dragnet-os/assets/images/explicit_binding_obj2_call.png)

The same as the first example, if we trace the second call on printname, the same reasoning applies that since obj1 is explicitly called every time printname is called, the values in the call stack will refliect the values defined for obj1. Thus, even though obj2 is not explicitly called in this statement, the local variable ```this.name = "Chris"``` is not called, and the name value inside ```obj1``` will be used. Printing out *Aidan*.

Explicitly defining the execution context for every instance of a function is known as ***fixed binding***.

### The ***new*** function call

When the ***new*** keyword is called on a function, it becomes a constructor call wherein:
1. A new empty object is created
2. New object is linked to the prototype property of that function.
3. New object gets bound as ***this*** keyword for execution context of that function call.
4. If that function does not return anything it implicitly returns the ***this*** object.

In the following code snipped from [codeburst.io](https://codeburst.io/all-about-this-and-new-keywords-in-javascript-38039f71780c):

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

![new bike call](/dragnet-os/assets/images/new_binding_bike_call.png)

As mentioned in the above steps, we can see that when the object is created, the ```bike()``` function creates two variables, the var name and the this.maker. When the ```console.log``` statement is called at the end of the object creation, this.name is undefined, as though var name is created, no value of name is instantiated for the ```this``` variable. And, though ```this.maker``` was created, the call to ```maker``` had no local variable created in the function stack, and thus refers to the global variable ```maker```, "Bajaj".

![console print bike call](/dragnet-os/assets/images/new_binding_print_call.png)

When this ```console.log``` statement is called, though we have the ```var name``` defined on the global stack, since the call to the maker attribute of the ```obj``` object changes the ```this``` value to the object stack, and ```this.maker``` refers to "Kawasaki".

We can see that the current execution context is important, as when the new bike object is created, it has empty values, returning an undefined this.name as no value was defined in the current execution state, but prints the maker as that was defined as a global variable, not a ***this*** variable.