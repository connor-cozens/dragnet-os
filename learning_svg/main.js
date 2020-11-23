class Slot {
    constructor(element) {
        this.element = element;
        // console.log("This element: " + this.element.x.baseVal.getItem(0).value)
        this.value = element.textContent;
        // console.log("Element Text Content: " + element.textContent)
        this.value = this.value.replace(/^\s+|\s+$/g, '');
        // console.log(this.value)
        // console.log("Node element: " + this.value + " bounding box: " + this.boundingBox.x);
    }

    fill(choice) {
        console.log(this.element);
        this.element.textContent = '';
        this.element.innerHTML = '';
        this.choice = choice;
        this.choice.choose()
    }

    isOverlapping(choice) {
        const choiceBB = choice.boundingBox;
        const slotBB = this.boundingBox;


        const [left, right] = choiceBB.left < slotBB.left
            ? [choiceBB, slotBB]
            : [slotBB, choiceBB];

        const [top, bottom]  = choiceBB.top < slotBB.top
            ? [choiceBB, slotBB]
            : [slotBB, choiceBB];

        return left.right >= right.left && top.bottom >= bottom.top;
    }

    hasChoice() {
        return !!this.choice;
    }

    hasCorrectChoice() {
        // console.log("Choice Value: " + this.choice.value + " and this value: " + this.value);
        return this.choice.value == this.value
    }

    get boundingBox() {
        const bb = this.element.getBoundingClientRect()
        bb.x = this.element.x.baseVal.getItem(0).value;
        bb.y = this.element.y.baseVal.getItem(0).value;
        return bb;
    }
}

class Choice {
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
        this.element = document.createElementNS('http://www.w3.org/2000/svg','text');
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

    choose() {
        this.isChosen = true;
        this.color = 'blue';
        this.render();
    }

    get boundingBox() {
        return this.element.getBoundingClientRect();
    }
}


function start(svg) {
    var texts = svg.getElementsByTagName('text');
    // console.log(texts)
    identifier = "_";
    let filledSlotCount = 0;
    const divs = Array.from(svg.getElementsByTagName('div'));
    // console.log(divs);
    const slots = Array.from(texts)
                       .map(s => new Slot(s));
    // console.log(slots);
    for (let i = 0; i < slots.length; i++) {
        // console.log(slots[i])
        if (!slots[i].value.includes(identifier)) {
            // console.log("Slot: " + slots[i].value + " with index: " + i + " does not contain the identifier.")
            slots.splice(i, 1);
            i--;
        }
        else {
            for (let j = 0; j < divs.length; j++) {
                if (divs[j].innerText == slots[i].value) {
                    divs[j].innerText = '_____';
                }
            }
        }
    }
    // console.log("Slots: ", slots);
    width = svg.getBoundingClientRect().width;
    height = svg.getBoundingClientRect().height;
    const choiceX = width - 100;
    const choiceY = 20;
    // console.log(svg.textContent)
    const choices = slots.map((s, i) => 
        new Choice(svg, slots[i].value, 
                   choiceX, (choiceY * (i+1)),
                   null, (evt, choice) => {
                        const selectedSlot = slots
                                .filter(s => !s.hasChoice())
                                .find(s => s.isOverlapping(choice))
                        if (selectedSlot) {
                            selectedSlot.fill(choice);
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

function complete(slots) {
    if (slots.every(s => s.hasCorrectChoice())) {
        alert("You did it!");
    } else {
        alert("Some answers were wrong...:(")
    }
}