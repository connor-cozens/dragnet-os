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
  constructor (element) {
    this.element = element
    this.value = element.textContent.replace(/^\s+|\s+$/g, '')
  }

  /**
   * Fills the slot with the given choice element, and calls the choice
   * element to lock and be filled in the locked color.
   *
   * @param {{ Choice: any; }} choice
   */
  fill (choice) {
    this.choice = choice
    this.choice.choose()
  }

  /**
   * Report whether a choice label currently overlaps a slot.
   *
   * @param {{ Choice: any; }} choice
   */
  isOverlapping (choice) {
    // Retrieve dimension boxes for the choice and slot in question
    const choiceBB = choice.boundingBox
    const slotBB = this.boundingBox

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
  hasChoice () {
    return !!this.choice
  }

  /**
   * When all labels are placed in slots, checks if a slot was given the correct choice.
   */
  hasCorrectChoice () {
    return this.choice.value === this.value
  }

  /**
   * Get the current slot's bounding box.
   *
   */
  get boundingBox () {
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
  constructor (svg, value, x, y, onDragStart, onDragEnd) {
    this.svg = svg
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
   * FIXME: documentation!
   */
  addInteractionListeners () {
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
   * FIXME: documentation!
   */
  addMovingListener () {
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
   * FIXME: documentation!
   */
  addFinishedMovingListener (onMouseMove) {
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
   * FIXME: documentation!
   */
  render () {
    this.element.setAttribute('class', 'choice')
    this.element.setAttribute('x', this.x)
    this.element.setAttribute('y', this.y)
    this.element.style.cursor = this.cursor
    this.element.style.fill = this.color
    this.element.style.fontSize = FONT_SIZE
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
  choose () {
    this.isChosen = true
    this.color = LOCKED_COLOR
    this.cursor = NORMAL_CURSOR
    this.render()
  }

  /**
   * Gets the bounding box of the choice for determining overlapping.
   */
  get boundingBox () {
    return this.element.getBoundingClientRect()
  }
}

class Dragnet {
  /**
   * Constructor which sets up relevant values for the Dragnet application.
   * @param {*} svg The SVG file the program is turning into an interactable application.
   */
  constructor (svg) {
    this.svg = svg
    this.slots = []
    this.divs = []
  }

  /**
   * Starts the application, creating and rendering all labels and their slots.
   */
  run () {
    const vals = this.extractNodes(this.svg)
    this.slots = vals[0]
    this.divs = vals[1]
    this.renderLabels(this.svg, this.slots, this.divs)
  }

  /**
   * FIXME: documentation!
   */
  extractNodes () {
    const texts = this.svg.getElementsByTagName('text')
    const divs = Array.from(this.svg.getElementsByTagName('div'))
    const slots = Array.from(texts).map(s => new Slot(s))
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

  /**
   * @param {*} svg The SVG file the program is turning into an interactable application.
   * @param {Slot} slots List of all available slots in the application.
   * @param {*} divs List of all div elements which the slots are stored in.
   */
  renderLabels (svg, slots, divs) {
    // Statically define where the choice labels are placed
    // TODO: Change to dynamic UI list/box
    const width = svg.getBoundingClientRect().width
    // const height = svg.getBoundingClientRect().height
    const choiceX = width - 100
    const choiceY = 20
    const choices = slots.map((s, i) =>
      new Choice(svg, slots[i].value,
                 choiceX, (choiceY * (i + 1)),
                 null,
                 (evt, choice) => this.handleChoice(slots, divs, choice)))
    for (const choice of choices) {
      choice.render()
    }
  }

  /**
   * handle choice
   * @param {Slot} slots List of all available slots in the application.
   * @param {*} divs List of all div elements which the slots are stored in.
   */
  handleChoice (slots, divs, choice) {
    let filledSlotCount = 0
    const selectedSlot = slots
      .filter(s => !s.hasChoice())
      .find(s => s.isOverlapping(choice))
    if (selectedSlot) {
      selectedSlot.fill(choice)
      for (let j = 0; j < divs.length; j++) {
        if (divs[j].value === selectedSlot.value) {
          divs[j].innerText = ''
        }
      }
      filledSlotCount++
    }
    if (filledSlotCount === slots.length) {
      this.complete(slots)
    }
  }

  /**
   * FIXME: documentation!
   */
  complete (slots) {
    if (slots.every(s => s.hasCorrectChoice())) {
      alert('You did it!')
    } else {
      alert('Some answers were wrong...:(')
    }
  }
}
