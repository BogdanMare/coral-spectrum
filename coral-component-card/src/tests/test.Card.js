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
import {Card} from '../../../coral-component-card';

describe('Card', function () {
  describe('Namespace', function () {
    it('should be defined', function () {
      expect(Card).to.have.property('Context');
      expect(Card).to.have.property('Description');
      expect(Card).to.have.property('Title');
      expect(Card).to.have.property('Property');
      expect(Card).to.have.property('Asset');
      expect(Card).to.have.property('Overlay');
      expect(Card).to.have.property('Info');
      expect(Card).to.have.property('Content');
      expect(Card).to.have.property('PropertyList');
      expect(Card.Property).to.have.property('Content');
    });

    it('should define the variants in an enum', function () {
      expect(Card.variant).to.exist;
      expect(Card.variant.DEFAULT).to.equal('default');
      expect(Card.variant.CONDENSED).to.equal('condensed');
      expect(Card.variant.INVERTED).to.equal('inverted');
      expect(Card.variant.ASSET).to.equal('asset');
      expect(Card.variant.QUIET).to.equal('quiet');
      expect(Object.keys(Card.variant).length).to.equal(5);
    });
  });

  describe('Instantiation', function () {
    helpers.cloneComponent(
      'should be possible to clone using markup',
      window.__html__['Card.base.html']
    );

    helpers.cloneComponent(
      'should be possible to clone using js',
      new Card()
    );
  });

  describe('API', function () {
    describe('#asset', function () {
    });

    describe('#content', function () {
    });

    describe('#assetheight', function () {
    });

    describe('#assetwidth', function () {
    });

    describe('#colorhint', function () {
    });

    describe('#image', function () {
    });

    describe('#info', function () {
    });

    describe('#overlay', function () {
    });

    describe('#stacked', function () {
    });

    describe('#variant', function () {
    });
  });

  describe('Markup', function () {
    describe('#asset', function () {
    });

    describe('#assetheight', function () {
    });

    describe('#assetwidth', function () {
    });

    describe('#colorhint', function () {
    });

    describe('#content', function () {
      // @todo: it should copy everything to the default content zone
    });

    describe('#info', function () {
    });

    describe('#overlay', function () {
      // @todo: it should make the overlay optional
    });

    describe('#stacked', function () {
    });

    describe('#variant', function () {
      it('should be initially Card.variant.DEFAULT', function () {
        const el = helpers.build(window.__html__['Card.base.html']);
        expect(el.variant).to.equal(Card.variant.DEFAULT);
        expect(el.getAttribute('variant')).to.equal(Card.variant.DEFAULT);
      });

      it('should set the new variant', function () {
        const el = helpers.build(window.__html__['Card.variant.condensed.html']);
        expect(el.variant).to.equal(Card.variant.CONDENSED);
        expect(el.getAttribute('variant')).to.equal('condensed');

        expect(el.classList.contains('_coral-Card--condensed')).to.be.true;
        expect(el.classList.contains('_coral-Card')).to.be.true;
      });
    });
  });

  // @todo: test multiple images loaded
  // @todo: test cached images
  describe('Implementation Details', function () {
  });
});
