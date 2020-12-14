/**
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {Keys} from '../../../../coral-utils';

/**
 Note: these helpers are implicitly tested by test.keys.js
 */
var modifierEventProperties = {
  16: 'shiftKey',
  17: 'ctrlKey',
  18: 'altKey',
  91: 'metaKey'
};

/**
 Convert a char or key code to a normalized key code
 */
function getCode(char) {
  if (typeof char === 'number') {
    return char;
  }

  return Keys.keyToCode(char);
}

/**
 Trigger a keydown event on the given element.

 @param {Number} code
 The key code to trigger
 @param {HTMLElement} [el=document.documentElement]
 The element to trigger the event on
 @param {Array.<String>} modifiers
 An array of modifiers to include in the event
 @param {String} key
 The key string
 */
const keydown = function (code, el, modifiers, key) {
  code = getCode(code);

  el = el || document.documentElement;
  var event = document.createEvent('Event');
  event.initEvent('keydown', true, true);
  event.keyCode = code;
  event.which = code;
  event.key = key;

  if (modifiers && modifiers.length > 0) {
    for (var i = 0 ; i < modifiers.length ; i++) {
      var modifierCode = getCode(modifiers[i]);
      var modifierEventProperty = modifierEventProperties[modifierCode];
      event[modifierEventProperty] = true;
    }
  }

  el.dispatchEvent(event);
};

/**
 Trigger a keyup event on the given element.

 @param {Number} code
 The key code to trigger
 @param {HTMLElement} [el=document.documentElement]
 The element to trigger the event on
 */
const keyup = function (code, el) {
  code = getCode(code);

  el = el || document.documentElement;
  var event = document.createEvent('Event');
  event.initEvent('keyup', true, true);
  event.keyCode = code;
  event.which = code;

  el.dispatchEvent(event);
};

/**
 Trigger a keydown and keyup event on the given element, focusing on it first.

 @param {Number} code
 The key code to trigger
 @param {HTMLElement} [el=document.documentElement]
 The element to trigger the event on
 @param {Array.<String>} modifiers
 An array of modifiers to include in the event
 @param {String} key
 The key string
 */
const keypress = function (code, el, modifiers, key) {
  if (el) {
    el.focus();
  }

  keydown(code, el, modifiers, key);
  keyup(code, el);
};

export {keydown, keyup, keypress};
