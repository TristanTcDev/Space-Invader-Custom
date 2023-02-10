import { Key, Keyboard } from 'keyboard-ts'

// Doc : https://www.npmjs.com/package/keyboard-ts

function createKeyboard(container, world) {

  // make the container able to receive key events
  container.tabIndex = 1;
  container.focus();

  const keyboard = new Keyboard(container);

  keyboard.on([Key.Numpad0], event => {
    // event is classic HTML event
    event.preventDefault()
    world.changeCamera0();
  })
  keyboard.on([Key.Numpad1], event => {
    // event is classic HTML event
    event.preventDefault()
    world.changeCamera1();
  })
  keyboard.on([Key.Numpad2], event => {
    // event is classic HTML event
    event.preventDefault()
    world.changeCamera2();
  })
  keyboard.on([Key.LeftArrow], event => {
    // event is classic HTML event
    event.preventDefault()
    world.mooveLeft();
  })
  keyboard.on([Key.RightArrow], event => {
    // event is classic HTML event
    event.preventDefault()
    world.mooveRight();
  })
  keyboard.on([Key.Space], event => {
    // event is classic HTML event
    event.preventDefault()
    world.shoot();
  })
  keyboard.on([Key.I], event => {
    // event is classic HTML event
    event.preventDefault()
    world.invincible();
  })
  keyboard.on([Key.K], event => {
    // event is classic HTML event
    event.preventDefault()
    world.killall();
  })
  return keyboard;
}

export { createKeyboard };
