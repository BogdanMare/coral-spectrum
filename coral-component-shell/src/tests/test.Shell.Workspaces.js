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
import {Shell} from '../../../coral-component-shell';
import {Collection} from '../../../coral-collection';

describe('Shell.Workspaces', function () {
  describe('Namespace', function () {
    it('should be defined in the Shell namespace', function () {
      expect(Shell).to.have.property('Workspace');
      expect(Shell).to.have.property('Workspaces');
    });
  });

  describe('Instantiation', function () {
    it('should support creation from markup', function () {
      const el = helpers.build('<coral-shell-workspaces>');
      expect(el instanceof Shell.Workspaces).to.equal(true);
    });

    it('should support creation from js', function () {
      var el = helpers.build(new Shell.Workspaces());
      expect(el instanceof Shell.Workspaces).to.equal(true);
    });

    it('should create a workspaces component with predefined items', function () {
      const el = helpers.build(window.__html__['Shell.Workspaces.base.html']);
      expect(el.items.length).to.equal(3);
    });

    helpers.cloneComponent(
      'should be possible to clone using markup',
      window.__html__['Shell.Workspaces.selected.html']
    );
  });

  describe('API', function () {
    describe('#items', function () {
      it('should return the workspaces items', function () {
        const el = helpers.build(window.__html__['Shell.Workspaces.base.html']);
        expect(el.items instanceof Collection).to.equal(true);
      });

      it('should have no effect when setting items', function () {
        const el = helpers.build(window.__html__['Shell.Workspaces.base.html']);
        var items = el.items;
        try {
          el.items = new Collection();
        } catch (e) {
          expect(el.items).to.equal(items);
        }
      });
    });

    describe('#selected', function () {
      it('should select another item', function () {
        const el = helpers.build(window.__html__['Shell.Workspaces.selected.html']);
        var item = el.items.getAll()[2];
        item.selected = true;
        expect(el.selectedItem).to.equal(item);
      });
    });
  });

  describe('Events', function () {
    describe('change', function () {
      it('should not trigger a change when selected is in the DOM', function () {
        var changeSpy = sinon.spy();

        document.addEventListener('coral-shell-workspaces:change', changeSpy);

        const el = helpers.build(window.__html__['Shell.Workspaces.selected.html']);

        expect(el.selectedItem).to.equal(el.items.getAll()[0]);
        expect(changeSpy.callCount).to.equal(0);
        document.removeEventListener('coral-shell-workspaces:change', changeSpy);
      });


      it('should trigger a change if a new element is selected', function () {
        var changeSpy = sinon.spy();

        document.addEventListener('coral-shell-workspaces:change', changeSpy);

        const el = helpers.build(window.__html__['Shell.Workspaces.selected.html']);

        expect(changeSpy.callCount).to.equal(0);

        var item1 = el.items.getAll()[0];
        var item2 = el.items.getAll()[1];

        // selects the new item
        item2.selected = true;

        expect(el.selectedItem).to.equal(item2);

        expect(changeSpy.callCount).to.equal(1);
        expect(changeSpy.args[0][0].detail.selection).to.equal(item2);
        expect(changeSpy.args[0][0].detail.oldSelection).to.equal(item1);

        document.removeEventListener('coral-shell-workspaces:change', changeSpy);
      });
    });
  });


  describe('User Interaction', function () {
    var item1;
    var item2;
    var item3;

    beforeEach(function () {
      const el = helpers.build(window.__html__['Shell.Workspaces.focus.html']);
      item1 = el.items.getAll()[0];
      item2 = el.items.getAll()[1];
      item3 = el.items.getAll()[2];
      el.items.first().focus();
    });

    describe('key:down', function () {
      it('should set focus on next element', function () {
        expect(document.activeElement).to.exist;
        expect(document.activeElement.id).to.equal(item1.id, 'Item 1 didn\'t get focus automatically');
        helpers.keydown('down', item1);

        expect(document.activeElement).to.exist;
        expect(document.activeElement.id).to.equal(item2.id, 'Item 2 didn\'t get focus automatically');
      });
    });

    describe('key:right', function () {
      it('should set focus on next element', function () {
        expect(document.activeElement).to.exist;
        expect(document.activeElement.id).to.equal(item1.id, 'Item 1 didn\'t get focus automatically');
        helpers.keydown('right', item1);

        expect(document.activeElement).to.exist;
        expect(document.activeElement.id).to.equal(item2.id, 'Item 2 didn\'t get focus automatically');
      });
    });

    describe('key:up', function () {
      it('should set focus on previous element', function () {
        expect(document.activeElement).to.exist;
        expect(document.activeElement.id).to.equal(item1.id, 'Item 1 didn\'t get focus automatically');
        helpers.keydown('up', item1);

        expect(document.activeElement).to.exist;
        expect(document.activeElement.id).to.equal(item3.id, 'Item 3 didn\'t get focus automatically');
      });
    });

    describe('key:left', function () {
      it('should set focus on previous element', function () {
        expect(document.activeElement).to.exist;
        expect(document.activeElement.id).to.equal(item1.id, 'Item 1 didn\'t get focus automatically');
        helpers.keydown('left', item1);

        expect(document.activeElement).to.exist;
        expect(document.activeElement.id).to.equal(item3.id, 'Item 3 didn\'t get focus automatically');
      });
    });

    describe('key:pageup', function () {
      it('should set focus on previous element', function () {
        expect(document.activeElement).to.exist;
        expect(document.activeElement.id).to.equal(item1.id, 'Item 1 didn\'t get focus automatically');
        helpers.keydown('pageup', item1);

        expect(document.activeElement).to.exist;
        expect(document.activeElement.id).to.equal(item3.id, 'Item 3 didn\'t get focus automatically');
      });
    });

    describe('key:pagedown', function () {
      it('should set focus on next element', function () {
        expect(document.activeElement).to.exist;
        expect(document.activeElement.id).to.equal(item1.id, 'Item 1 didn\'t get focus automatically');
        helpers.keydown('pagedown', item1);

        expect(document.activeElement).to.exist;
        expect(document.activeElement.id).to.equal(item2.id, 'Item 2 didn\'t get focus automatically');
      });
    });

    describe('key:home', function () {
      it('should set focus on first element', function () {
        expect(document.activeElement).to.exist;
        expect(document.activeElement.id).to.equal(item1.id, 'Item 1 didn\'t get focus automatically');
        item3.focus();

        expect(document.activeElement).to.exist;
        expect(document.activeElement.id).to.equal(item3.id, 'Item 3 didn\'t get focus automatically');
        helpers.keydown('home', item3);

        expect(document.activeElement).to.exist;
        expect(document.activeElement.id).to.equal(item1.id, 'Item 1 didn\'t get focus automatically');
      });
    });

    describe('key:end', function () {
      it('should set focus on last element', function () {
        expect(document.activeElement).to.exist;
        expect(document.activeElement.id).to.equal(item1.id, 'Item 1 didn\'t get focus automatically');
        helpers.keydown('end', item1);

        expect(document.activeElement).to.exist;
        expect(document.activeElement.id).to.equal(item3.id, 'Item 3 didn\'t get focus automatically');
      });
    });
  });

  describe('Implementation Details', () => {
    it('create a select based on the given workspaces', function () {
      const el = helpers.build(window.__html__['Shell.Workspaces.base.html']);
      const items = el.items.getAll();
      el._elements.select.items.getAll().forEach((item, i) => {
        expect(item.textContent === items[i].textContent);
      });
    });

    it('should sync the select based on the selected workspace', function () {
      const el = helpers.build(window.__html__['Shell.Workspaces.selected.html']);
      expect(el._elements.select.selectedItem).to.equal(el._elements.select.items.first());

      el.items.last().selected = true;
      expect(el._elements.select.selectedItem).to.equal(el._elements.select.items.last());
    });

    it('add an item to the selected if a new workspace is added', function () {
      const el = helpers.build(window.__html__['Shell.Workspaces.base.html']);
      el.items.add({
        label: {
          textContent: 'New item'
        }
      });

      const items = el.items.getAll();
      el._elements.select.items.getAll().forEach((item, i) => {
        expect(item.textContent === items[i].textContent);
      });
    });
  });
});
