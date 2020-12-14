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
import {Table} from '../../../coral-component-table';

describe('Table.Column', function () {
  describe('Namespace', function () {
    it('should be defined', function () {
      expect(Table).to.have.property('Column');
    });

    it('should expose enums', function () {
      expect(Table.Column).to.have.property('sortableType');
      expect(Table.Column).to.have.property('sortableDirection');
    });
  });

  describe('Instantiation', function () {
    it('should be possible using new', function () {
      const el = helpers.build(new Table.Column());
      expect(el.classList.contains('_coral-Table-column')).to.be.true;
    });

    it('should be possible using document.createElement', function () {
      const el = helpers.build(document.createElement('col', {is: 'coral-table-column'}));
      expect(el.classList.contains('_coral-Table-column')).to.be.true;
    });
  });

  describe('API', function () {

    describe('#fixedWidth', function () {
    });

    describe('#hidden', function () {
    });

    describe('#orderable', function () {
    });

    describe('#sortable', function () {
    });

    describe('#sortableType', function () {
      it('should default to sortableType.ALPHANUMERIC', function () {
        const el = new Table.Column();
        expect(el.sortableType).to.equal(Table.Column.sortableType.ALPHANUMERIC);
      });
    });

    describe('#sortableDirection', function () {
      it('should default to sortableDirection.DEFAULT', function () {
        const el = new Table.Column();
        expect(el.sortableDirection).to.equal(Table.Column.sortableDirection.DEFAULT);
      });
    });

    describe('#alignment', function () {
      it('should default to alignment.LEFT', function () {
        const el = new Table.Column();
        expect(el.alignment).to.equal(Table.Column.alignment.LEFT);
      });
    });
  });

  describe('Events', function () {
    let el = null;
    let spy = null;

    beforeEach(function () {
      el = new Table.Column();
      spy = sinon.spy();
    });

    afterEach(function () {
      el = null;
      spy = null;
    });

    describe('#coral-table-column:_fixedwidthchanged', function () {
      it('should trigger when changing fixedWidth', function (done) {
        el.on('coral-table-column:_fixedwidthchanged', spy);
        el.fixedWidth = true;

        helpers.next(() => {
          expect(spy.callCount).to.equal(1);
          done();
        });
      });
    });

    describe('#coral-table-column:_hiddenchanged', function () {
      it('should trigger when changing hidden', function (done) {
        el.on('coral-table-column:_hiddenchanged', spy);
        el.hidden = true;

        // Event is triggered in next frame
        helpers.next(() => {
          expect(spy.callCount).to.equal(1);
          done();
        });
      });
    });

    describe('#coral-table-column:_orderablechanged', function () {
      it('should trigger when changing orderable', function (done) {
        el.on('coral-table-column:_orderablechanged', spy);
        el.orderable = true;

        // Event is triggered in next frame
        helpers.next(function () {
          expect(spy.callCount).to.equal(1);
          done();
        });
      });
    });

    describe('#coral-table-column:_sortablechanged', function () {
      it('should trigger when changing sortable', function (done) {
        el.on('coral-table-column:_sortablechanged', spy);
        el.sortable = true;

        // Event is triggered in next frame
        helpers.next(function () {
          expect(spy.callCount).to.equal(1);
          done();
        });
      });
    });

    describe('#coral-table-column:_sortabledirectionchanged', function () {
      it('should trigger when changing sortableDirection', function (done) {
        el.on('coral-table-column:_sortabledirectionchanged', spy);
        el.sortableDirection = Table.Column.sortableDirection.ASCENDING;

        helpers.next(() => {
          expect(spy.callCount).to.equal(1);
          done();
        });
      });
    });

    describe('#coral-table-column:_sort', function () {
      it('should trigger when changing sortableDirection', function () {
        el.on('coral-table-column:_sort', spy);
        el.sortableDirection = Table.Column.sortableDirection.ASCENDING;

        expect(spy.callCount).to.equal(1);
      });
    });
  });
});
