/**
 * Active describes labels which are interactable by the user.
 * Locked describes labels which have been placed and are not interactable.
 */
const ACTIVE_COLOR = 'green'
const ACTIVE_CURSOR = 'move'
const LOCKED_COLOR = 'blue'
const NORMAL_CURSOR = 'auto'
const FONT_SIZE = '15px'
const IDENTIFIER = '_'

/**
 * Slot defines the slots that each label can be placed into, and are
 * created dynamically from the list of all chosen labels.
 */
class Slot {
  /**
   * Creates the Slot element with the given text from the labels and remove
   * irrelevant whitespace and newline characters added in exporting in certain
   * programs such as Inkscape.
   *
   * @param {{ textContent: any; }} element
   * @constructor
   */
  constructor(element) {
    this.element = element
    this.value = element.textContent.replace(/^\s+|\s+$/g, '')
  }

  /**
   * Fills the slot with the given choice element, and calls the choice
   * element to lock and be filled in the locked color.
   *
   * @param {{ Choice: any; }} choice
   */
  fill(choice) {
    this.choice = choice
    this.choice.choose()
  }

  /**
   * Report whether a choice label currently overlaps a slot.
   *
   * @param {{ Choice: any; }} choice
   */
  isOverlapping(choice) {
    // Retrieve dimension boxes for the choice and slot in question
    const choiceBB = choice.boundingBox
    const slotBB = this.boundingBox

    console.log('choice at: ', choiceBB)
    console.log('slot at: ', slotBB)

    // Decide which element is on the left and which is on the right
    const [leftmostElement, rightmostElement] = choiceBB.left < slotBB.left
      ? [choiceBB, slotBB]
      : [slotBB, choiceBB]

    // Decide which element is higher and which element is lower
    const [topmostElement, bottommostElement] = choiceBB.top < slotBB.top
      ? [choiceBB, slotBB]
      : [slotBB, choiceBB]

    // Determine if the choice and its slot are intersecting in either the x or y dimensions
    const xIntersecting = leftmostElement.right >= rightmostElement.left
    const yIntersecting = topmostElement.bottom >= bottommostElement.top

    // Return whether a choice is intersecting a slot
    return xIntersecting && yIntersecting
  }

  /**
   * Used to check if a slot has a valid choice.
   */
  hasChoice() {
    return !!this.choice
  }

  /**
   * When all labels are placed in slots, checks if a slot was given the correct choice.
   */
  hasCorrectChoice() {
    return this.choice.value === this.value
  }

  /**
   * Get the current slot's bounding box.
   *
   */
  get boundingBox() {
    const bb = this.element.getBoundingClientRect()
    bb.x = this.element.x.baseVal.getItem(0).value
    bb.y = this.element.y.baseVal.getItem(0).value
    return bb
  }
}

/**
 * Choices are the labels which are extracted from the SVG and are the elements which a user
 * can interact with, and drag into slot elements.
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
    this.svg = svg
    this.fontsize = this.svg.getElementsByTagName('text')[0].getAttribute('font-size')
    if (!this.fontsize) {
      this.fontsize = FONT_SIZE
    }
    this.value = value
    this.value = this.value.replace(/^\s+|\s+$/g, '')
    this.x = x
    this.y = y
    this.cursor = ACTIVE_CURSOR
    this.color = ACTIVE_COLOR
    this.isRendered = false
    this.isChosen = false
    this.onDragStart = onDragStart
    this.onDragEnd = onDragEnd
    this.element = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    this.addInteractionListeners()
  }

  /**
   * Function adds mousedown listeners to chosen elements on interaction start.
   */
  addInteractionListeners() {
    this.element.addEventListener('mousedown', downEvent => {
      if (this.isChosen) {
        return
      }

      if (this.onDragStart) {
        this.onDragStart(downEvent, this)
      }
      if (downEvent.defaultPrevented) {
        return
      }

      const onMouseMove = this.addMovingListener()
      this.addFinishedMovingListener(onMouseMove)
    })
  }

  /**
   * Function adds movement listeners to chosen elements when they are being dragged 
   * around the diagram.
   */
  addMovingListener() {
    const onMouseMove = moveEvent => {
      const elementBB = this.element.getBoundingClientRect()
      const elementWidth = elementBB.width
      const elementHeight = elementBB.height
      const windowBB = this.svg.getBoundingClientRect()
      const windowWidth = windowBB.width
      const windowHeight = windowBB.height
      const windowX = windowBB.left
      const windowY = windowBB.top
      this.svg.style.cursor = ACTIVE_CURSOR
      if (moveEvent.clientX < windowX || moveEvent.clientX > (windowWidth - elementWidth)) {
        console.log('Outside of width bounds.')
      } else if (moveEvent.clientY < (windowY + elementHeight) || moveEvent.clientY > windowHeight) {
        console.log('Outside of height bounds.')
      } else {
        this.x = moveEvent.clientX
        this.y = moveEvent.clientY
        this.render()
      }
    }
    this.svg.addEventListener('mousemove', onMouseMove)
    return onMouseMove
  }

  /**
   * Function adds placement listeners to chosen elements for when they are being placed,
   * removing movement and selected listeners.
   */
  addFinishedMovingListener(onMouseMove) {
    const onMouseUp = upEvent => {
      if (this.onDragEnd) {
        this.onDragEnd(upEvent, this)
      }
      this.svg.style.cursor = NORMAL_CURSOR
      this.svg.removeEventListener('mousemove', onMouseMove)
      this.svg.removeEventListener('mouseup', onMouseUp)
    }
    this.svg.addEventListener('mouseup', onMouseUp)
  }

  /**
   * Renders the current element by adding it to the SVG element and locking in it's chosen
   * attributes.
   */
  render() {
    this.element.setAttribute('class', 'choice')
    this.element.setAttribute('x', this.x)
    this.element.setAttribute('y', this.y)
    this.element.style.cursor = this.cursor
    this.element.style.fill = this.color
    this.element.style.fontSize = this.fontsize
    this.element.style.fontWeight = 'bold'
    this.element.textContent = this.value
    if (!this.isRendered) {
      this.svg.appendChild(this.element)
      this.isRendered = true
    }
  }

  /**
   * Marks a choice element as having been chosen, and put into a slot - makes the choice
   * uninteractable.
   */
  choose() {
    this.isChosen = true
    this.color = LOCKED_COLOR
    this.cursor = NORMAL_CURSOR
    this.render()
  }

  /**
   * Gets the bounding box of the choice for determining overlapping.
   */
  get boundingBox() {
    return this.element.getBoundingClientRect()
  }
}

class Dragnet {
  /**
   * Constructor which sets up relevant values for the Dragnet application.
   * @param {*} svg The SVG file the program is turning into an interactable application.
   */
  constructor(svg) {
    this.svg = svg
    this.slots = []
    this.divs = []
    this.filledSlotCount = 0
    // 0 = no feedback, 1 = all correct/incorrect, 2 = how many correct, 3 = what was incorrect, 4 = what was incorrect and the correct answer
    this.feedbackMethod = 3
  }

  /**
   * Starts the application, creating and rendering all labels and their slots.
   */
  run() {
    const vals = this.extractNodes(this.svg)
    this.slots = vals[0]
    this.divs = vals[1]
    this.renderLabels(this.svg, this.slots, this.divs)
  }

  /**
   * Returns all text elements from the current svg object that contain the identifier
   * character as Slot objects.
   */
  extractNodes() {
    const texts = this.svg.getElementsByTagName('text')
    const divs = Array.from(this.svg.getElementsByTagName('div'))
    console.log('divs', divs)
    // const tspans = Array.from(this.svg.getElementsByTagName('tspan'))
    // console.log('tspans', tspans)
    console.log('text', texts)
    // Handle tspan Elements
    if (divs.length == 0) {
      const slots = Array.from(texts).map(s => new Slot(s))
      // Remove all slots that don't include the identifier
      for (let i = 0; i < slots.length; i++) {
        // console.log(slots[i])
        if (!slots[i].value.includes(IDENTIFIER)) {
          slots.splice(i, 1)
          i--
        } else {
          for (let j = 0; j < texts.length; j++) {
            texts[j].textContent = texts[j].textContent.trim()
            // console.log(texts[j].textContent)
            // console.log(slots[i].value)
            if (texts[j].textContent === slots[i].value) {
              console.log(texts[j])
              texts[j].innerHTML = '_____'
              texts[j].value = slots[i].value.replace(/_/g, '')
              console.log(texts[j].value)
            }
          }
          slots[i].value = slots[i].value.replace(/_/g, '')
        }
      }
      console.log('Slots: ', slots)
      console.log('texts: ', texts)
      return [slots, texts]
    }
    // Handle div Elements
    else {
      const slots = Array.from(divs).map(s => new Slot(s))
      // Remove all slots that don't include the identifier
      for (let i = 0; i < slots.length; i++) {
        if (!slots[i].value.includes(IDENTIFIER)) {
          slots.splice(i, 1)
          i--
        } else {
          for (let j = 0; j < divs.length; j++) {
            if (divs[j].innerText === slots[i].value) {
              divs[j].innerText = '_____'
              divs[j].value = slots[i].value.replace(/_/g, '')
            }
          }
          slots[i].value = slots[i].value.replace(/_/g, '')
        }
      }
      return [slots, divs]
    }
  }

  /**
   * @param {*} svg The SVG file the program is turning into an interactable application.
   * @param {Slot} slots List of all available slots in the application.
   * @param {*} divs List of all div elements which the slots are stored in.
   */
  renderLabels(svg, slots, divs) {
    // Statically define where the choice labels are placed
    // TODO: Change to dynamic UI list/box
    const width = svg.getBoundingClientRect().width
    // const height = svg.getBoundingClientRect().height
    const choiceX = width - 100
    const choiceY = 20
    let ychoices = []
    for (let j = 0; j < slots.length; j++) { ychoices.push((j + 1) * choiceY) }
    let shuffled_choices = this.shuffle(ychoices)
    const choices = slots.map((s, i) =>
      new Choice(svg, slots[i].value,
        choiceX, shuffled_choices[i],
        null,
        (evt, choice) => this.handleChoice(slots, divs, choice)))
    for (const choice of choices) {
      choice.render()
    }
  }

  /**
   * Takes an array and returns a randomly shuffled array.
   * @param {*} array An array to be shuffled.
   */
  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }
    return array
  }

  /**
   * handle choice
   * @param {Slot} slots List of all available slots in the application.
   * @param {*} divs List of all div elements which the slots are stored in.
   */
  handleChoice(slots, divs, choice) {
    const selectedSlot = slots
      .filter(s => !s.hasChoice())
      .find(s => s.isOverlapping(choice))
    if (selectedSlot) {
      selectedSlot.fill(choice)
      for (let j = 0; j < divs.length; j++) {
        console.log('value: ', divs[j].value, '\nslot value: ', selectedSlot.value)
        if (divs[j].value === selectedSlot.value) {
          divs[j].innerText = ''
        }
      }
      this.filledSlotCount++
    }

    if (this.filledSlotCount === slots.length) {
      this.complete(slots)
    }
  }

  /**
   * Returns if each slot in the diagram has been answered correctly.
   */
  complete(slots) {
    const correct_choices = slots.filter(s => s.value === s.choice.value)
    const incorrect_choices = slots.filter(s => s.value !== s.choice.value)
    const num_correct = correct_choices.length
    const num_total = slots.length

    if (this.feedbackMethod === 0) {
      alert(`Your answers have been submitted!`)
    } else if (this.feedbackMethod === 1) {
      if (num_correct === num_total) {
        alert(`Your answers have been submitted, you got everything correct!`)
      } else {
        alert(`Your answers have been submitted, some answers were wrong.`)
      }
    } else if (this.feedbackMethod === 2) {
      if (num_correct === num_total) {
        alert(`You did it! You got ${num_correct}/${num_total} correct!`)
      } else {
        alert(`Some answers were wrong, you got ${num_correct}/${num_total} correct!`)
      }
    } else if (this.feedbackMethod === 3) {
      if (num_correct === num_total) {
        alert(`You did it! You got ${num_correct}/${num_total} correct!`)
      } else {
        let alert_message = `Some answers were wrong, you got ${num_correct}/${num_total} correct!`
        incorrect_choices.forEach(s => {
          alert_message = alert_message + `\n - You incorrectly marked ${s.choice.value}`
        })
        alert(alert_message)
      }
    } else {
      if (num_correct === num_total) {
        alert(`You did it! You got ${num_correct}/${num_total} correct!`)
      } else {
        let alert_message = `Some answers were wrong, you got ${num_correct}/${num_total} correct!`
        incorrect_choices.forEach(s => {
          alert_message = alert_message + `\n - You incorrectly marked ${s.value} as ${s.choice.value}`
        })
        alert(alert_message)
      }
    }


  }
}
