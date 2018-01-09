describe('Coral.Drawer', function () {
  describe('Namespace', function() {
    it('should be defined', function() {
      expect(Coral).to.have.property('Drawer');
      expect(Coral.Drawer).to.have.property('Content');
    });
  });
  
  describe('Instantiation', function() {
    it('should be possible using new', function() {
      var drawer = helpers.build(new Coral.Drawer());
      expect(drawer.open).to.be.false;
      expect(drawer.hasAttribute('open')).to.be.false;
      expect(drawer.getAttribute('direction')).to.equal(Coral.Drawer.direction.DOWN);
      expect(drawer.classList.contains('coral3-Drawer')).to.be.true;
    });
    
    it('should be possible to clone the element using markup', function() {
      helpers.cloneComponent(window.__html__['Coral.Drawer.default.html']);
    });
    
    it('should be possible to clone the element with open using markup', function() {
      helpers.cloneComponent(window.__html__['Coral.Drawer.open.html']);
    });
    
    it('should be possible to clone the element direction using markup', function() {
      helpers.cloneComponent(window.__html__['Coral.Drawer.up.html']);
    });
    
    it('should be possible to clone using js', function() {
      var el = new Coral.Drawer();
      el.content.innerHTML = 'Test';
      helpers.cloneComponent(el);
    });
  });
  
  describe('Markup', function() {

    describe('#open', function() {
      it('should be closed by default', function() {
        var drawer = helpers.build(window.__html__['Coral.Drawer.default.html']);
        expect(drawer.open).to.be.false;
        expect(drawer._elements.slider.style.height).to.equal('0px');
      });
  
      it('should open the drawer if open is set to true', function(done) {
        var drawer = helpers.build(window.__html__['Coral.Drawer.default.html']);
        drawer.open = true;
    
        expect(drawer.getAttribute('aria-expanded')).to.equal('true');
        // Transition happens in the next task
        window.setTimeout(function() {
          expect(drawer._elements.slider.style.height).to.not.equal('0px');
          done();
        }, 10);
      });
  
      it('should close the drawer if open is set to false', function(done) {
        var drawer = helpers.build(window.__html__['Coral.Drawer.open.html']);
        drawer.open = false;
    
        expect(drawer.getAttribute('aria-expanded')).to.equal('false');
        // Transition happens in the next task
        window.setTimeout(function() {
          expect(drawer._elements.slider.style.height).to.equal('0px');
          done();
        }, 10);
      });
    });
    
    describe('#direction', function() {
      it('should set direction class up', function() {
        var drawer = helpers.build(window.__html__['Coral.Drawer.default.html']);
        expect(drawer.direction).to.equal('down');
        expect(drawer.classList.contains('coral3-Drawer--down')).to.be.true;
    
        drawer.direction = 'up';
        expect(drawer.classList.contains('coral3-Drawer--up')).to.be.true;
      });
  
      it('should set direction class down', function() {
        var drawer = helpers.build(window.__html__['Coral.Drawer.up.html']);
        expect(drawer.direction).to.equal('up');
        expect(drawer.classList.contains('coral3-Drawer--up')).to.be.true;
        drawer.direction = 'down';
    
        expect(drawer.classList.contains('coral3-Drawer--down')).to.be.true;
      });
    });

    describe('#disabled', function() {
      it('should hide the toggle and set aria-disabled', function() {
        var drawer = helpers.build(window.__html__['Coral.Drawer.default.html']);
        expect(drawer.disabled).to.be.false;
        drawer.disabled = true;
        
        expect(drawer.getAttribute('aria-disabled')).to.equal('true');
        expect(drawer._elements.toggle.hidden).to.be.true;
      });
    });
    
    describe('#content', function() {
      it('should use the innerHTML of the drawer to set its content', function() {
        var drawer = helpers.build(window.__html__['Coral.Drawer.default.html']);
        expect(drawer._elements.content.innerHTML).to.equal('<textarea></textarea>');
      });
    });
  });
  
  describe('API', function() {
    let el = null;
    
    beforeEach(function() {
      el = new Coral.Drawer();
    });
    
    afterEach(function() {
      el = null;
    });
    
    describe('#open', function() {
      it('should default to false', function() {
        expect(el.disabled).to.be.false;
      });
    });
  
    describe('#direction', function() {
      it('should default to down', function() {
        expect(el.direction).to.equal(Coral.Drawer.direction.DOWN);
      });
    });
  
    describe('#disabled', function() {
      it('should default to false', function() {
        expect(el.disabled).to.equal(false);
      });
    });
    
    describe('#content', function() {
      it('should have an empty content zone', function() {
        expect(el.content.innerHTML).to.equal('');
      });
    });
  });

  describe('Events', function() {
    const transition = 100;
    let transitionEnd = Coral.commons.transitionEnd;
    
    beforeEach(function() {
      // Simulate transition ended after 100 ms
      Coral.commons.transitionEnd = function(el, cb) {
        window.setTimeout(function() {
          cb();
        }, transition);
      };
    });
    
    afterEach(function() {
      Coral.commons.transitionEnd = transitionEnd;
    });
    
    it('should trigger coral-drawer:open', function(done) {
      var drawer = helpers.build(window.__html__['Coral.Drawer.default.html']);
      drawer.on('coral-drawer:open', function() {
        expect(drawer._elements.slider.style.height).to.not.equal('0px');
        done();
      });
      drawer.open = true;
    });
  
    it('should not trigger coral-drawer:open if silenced', function(done) {
      var drawer = helpers.build(window.__html__['Coral.Drawer.default.html']);
      var openSpy = sinon.spy();
      drawer.on('coral-drawer:open', openSpy);
      drawer.set('open', true, true);
      
      setTimeout(function() {
        expect(openSpy.callCount).to.equal(0);
        
        done();
      }, transition + 1);
    });

    it('should trigger coral-drawer:close', function(done) {
      var drawer = helpers.build(window.__html__['Coral.Drawer.open.html']);
      drawer.on('coral-drawer:close', function() {
        expect(drawer._elements.slider.style.height).to.equal('0px');
        done();
      });
      drawer.open = false;
    });

    it('should toggle coral-drawer on toggle click', function() {
      var drawer = helpers.build(window.__html__['Coral.Drawer.open.html']);
      drawer._elements.toggleButton.click();
      
      expect(drawer.open).to.be.false;
    });
  });
});
