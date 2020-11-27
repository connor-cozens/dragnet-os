/**
 * Slot defines the slots that each label can be placed into, and are
 * created dynamically from the list of all chosen labels.
 */
class Slot {
    /**
     * Create the Slot element with the given text from the labels and remove
     * extra white space and newline characters created in SVG exporting.
     * 
     * @param {{ textContent: any; }} element
     * @constructor
     */
    constructor(element) {
        this.element = element;
        this.value = element.textContent;
        this.value = this.value.replace(/^\s+|\s+$/g, '');
    }

    /**
     * Fills the slot with the given choice element, and calls the choice
     * element to lock and be filled blue.
     * 
     * @param {{ Choice: any; }} choice
     */
    fill(choice) {
        this.choice = choice;
        this.choice.choose()
    }

    /**
     * Checks if there is a choice label currently overlapping the slot, and if so
     * return boolean true or false.
     * 
     * @param {{ Choice: any; }} choice 
     */
    isOverlapping(choice) {
        const choiceBB = choice.boundingBox;
        const slotBB = this.boundingBox;

        const [left, right] = choiceBB.left < slotBB.left
            ? [choiceBB, slotBB]
            : [slotBB, choiceBB];

        const [top, bottom] = choiceBB.top < slotBB.top
            ? [choiceBB, slotBB]
            : [slotBB, choiceBB];

        return left.right >= right.left && top.bottom >= bottom.top;
    }

    /**
     * Used in initialization to ensure each slot has a corresponding valid choice.
     * 
     */
    hasChoice() {
        return !!this.choice;
    }

    /**
     * When all labels are placed in slots, checks if a slot was given the corrent choice.
     * 
     */
    hasCorrectChoice() {
        // console.log("Choice Value: " + this.choice.value + " and this value: " + this.value);
        return this.choice.value == this.value
    }

    /**
     * Returns the bounding box for the slot to use for overlapping and choice detection.
     * 
     */
    get boundingBox() {
        const bb = this.element.getBoundingClientRect()
        bb.x = this.element.x.baseVal.getItem(0).value;
        bb.y = this.element.y.baseVal.getItem(0).value;
        return bb;
    }
}

/**
 * Choices are the labels which are extracted from the SVG and are the elements which a user
 * can interact with, and drag into slot elements.
 * 
 */
class Choice {
    /**
     * @param {any} svg The SVG file of the chosen diagram
     * @param {any} value The text value of the choice
     * @param {number} x The x-coordinate of the current location of the choice label
     * @param {number} y The y-coordinate of the current location of the choice label
     * @param {(arg0: MouseEvent, arg1: this) => void} onDragStart
     */
    constructor(svg, value, x, y, onDragStart, onDragEnd) {
        this.svg = svg;
        // console.log("SVG is: " + this.svg + "\nx is: " + x + "\ny is: " + y);
        this.value = value;
        this.value = this.value.replace(/^\s+|\s+$/g, '');
        this.x = x;
        this.y = y;
        this.color = 'black';
        this.isRendered = false;
        this.isChosen = false;
        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        this.element.addEventListener('mousedown', downEvent => {
            if (this.isChosen) {
                return;
            }

            if (onDragStart) {
                onDragStart(downEvent, this);
            }
            if (downEvent.defaultPrevented) {
                return;
            }

            const onMouseMove = moveEvent => {
                this.x = moveEvent.clientX;
                // console.log("This x: ", this.x, " client x: ", moveEvent.clientX);
                this.y = moveEvent.clientY;
                this.render();
            };
            this.svg.addEventListener('mousemove', onMouseMove);

            const onMouseUp = upEvent => {
                if (onDragEnd) {
                    onDragEnd(upEvent, this);
                }
                this.svg.removeEventListener('mousemove', onMouseMove);
                this.svg.removeEventListener('mouseup', onMouseUp);
            };
            this.svg.addEventListener('mouseup', onMouseUp);
        });
    }

    /**
     * Sets the current location of the choice to the given x and y coordinates, and
     * renders the choice if it hasn't previously been rendered.
     * 
     */
    render() {
        this.element.setAttribute('x', this.x);
        this.element.setAttribute('y', this.y);
        this.element.style.fill = this.color;
        this.element.style.fontSize = "15px";
        // console.log(this);
        // console.log("The value of 'this' in the render function: " + this.value);
        this.element.textContent = this.value;
        // console.log("Value is: " + this.value);
        if (!this.isRendered) {
            this.svg.appendChild(this.element);
            this.isRendered = true;
        }
    }

    /**
     * Marks a choice element as having been chosen, and put into a slot - makes the choice
     * uninteractable.
     * 
     */
    choose() {
        this.isChosen = true;
        this.color = 'blue';
        this.render();
    }

    /**
     * Gets the bounding box of the choice for determining overlapping.
     * 
     */
    get boundingBox() {
        return this.element.getBoundingClientRect();
    }
}

/**
 * Starts the initialization process for extracting all relevant information from the chosen
 * SVG diagram, extracting all labels, creating slots and choiecs, and making items
 * interactable.
 * 
 * @param {{ getElementsByTagName: (arg0: string) => Iterable<any> | ArrayLike<any>; getBoundingClientRect: () => { (): any; new (): any; width: any; height: any; }; }} svg
 */
function start(svg) {
    // Retrieve all text object from the diagram
    var texts = svg.getElementsByTagName('text');
    const identifier = "_"; // May want to make this dynamic / let the user choose
    let filledSlotCount = 0;
    // Retrieve all DIV elements to help in text matching
    const divs = Array.from(svg.getElementsByTagName('div'));
    // Create Slots from each text element
    const slots = Array.from(texts).map(s => new Slot(s));
    // Remove all slots that don't include the identifier
    for (let i = 0; i < slots.length; i++) {
        if (!slots[i].value.includes(identifier)) {
            slots.splice(i, 1);
            i--;
        }
        // If the slot does include the identifier, replace the text in the DIV to be an underline
        // so users understand they can place a label there, remove the identifier from the label
        else {
            for (let j = 0; j < divs.length; j++) {
                if (divs[j].innerText == slots[i].value) {
                    divs[j].innerText = '_____';
                    divs[j].value = slots[i].value.replace(/_/g, "");
                }
            }
            slots[i].value = slots[i].value.replace(/_/g, "")
        }
    }
    // Statically define where the choice labels are placed
    // TODO: Change to dynamic UI list/box
    width = svg.getBoundingClientRect().width;
    height = svg.getBoundingClientRect().height;
    const choiceX = width - 100;
    const choiceY = 20;
    const choices = slots.map((s, i) =>
        new Choice(svg, slots[i].value,
            choiceX, (choiceY * (i + 1)),
            null, (evt, choice) => {
                const selectedSlot = slots
                    .filter(s => !s.hasChoice())
                    .find(s => s.isOverlapping(choice))
                if (selectedSlot) {
                    selectedSlot.fill(choice);
                    for (let j = 0; j < divs.length; j++) {
                        if (divs[j].value == choice.value) {
                            divs[j].innerText = '';
                        }
                    }
                    filledSlotCount++;
                }
                if (filledSlotCount === slots.length) {
                    complete(slots);
                }
            }));
    // console.log(choices);
    for (let choice of choices) {
        choice.render();
    }
}

/**
 * When every slot has been filled with a choice, check if each choice was placed correctly,
 * and alert the user whether or not they chose each item corrently.
 * 
 * @param {any[]} slots
 */
function complete(slots) {
    //
    if (slots.every(s => s.hasCorrectChoice())) {
        alert("You did it!");
    }
    // 
    else {
        alert("Some answers were wrong...:(")
    }
}