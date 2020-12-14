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

import {helpers} from '../../../coral-utils/src/tests/helpers';
import {Textfield} from '../../../coral-component-textfield';

describe('Textfield', function () {

  describe('Instantiation', function () {
    helpers.cloneComponent(
      'should be possible via clone using markup',
      window.__html__['Textfield.base.html']
    );

    helpers.cloneComponent(
      'should be possible via clone using markup with textContent',
      window.__html__['Textfield.value.html']
    );

    helpers.cloneComponent(
      'should be possible via clone using js',
      new Textfield()
    );
  });

  describe('API', function () {
    var el;

    beforeEach(function () {
      el = new Textfield();
    });

    afterEach(function () {
      el = null;
    });

    describe('#value', function () {
      it('should return empty string by default', function () {
        expect(el.value).to.equal('');
      });
    });

    describe('#name', function () {
      it('should return empty string by default', function () {
        expect(el.name).to.equal('');
      });
    });

    describe('#placeholder', function () {
      it('should return empty string by default', function () {
        expect(el.placeholder).to.equal('');
      });
    });

    describe('#variant', function () {
      it('should be set to "default" by default', function () {
        expect(el.variant).to.equal(Textfield.variant.DEFAULT, '"default" should be set');
      });

      it('should be possible to set the variant', function () {
        expect(el.classList.contains('_coral-Textfield--quiet')).to.be.false;

        el.variant = Textfield.variant.QUIET;
        expect(el.variant).to.equal(Textfield.variant.QUIET, '"quiet" should be set');
        expect(el.classList.contains('_coral-Textfield--quiet')).to.be.true;
      });
    });
  });

  describe('Implementation Details', function () {
    describe('#formField', function () {
      helpers.testFormField(window.__html__['Textfield.value.html'], {
        value: 'abc'
      });
    });
  });
});
