describe("Classes", function () {
    before(function () {
        fixture.setBase("test/fixtures");
        this.newClass1 = "new1";
        this.newClass2 = "new2";
        this.hiddenClassName = Jamon.hiddenClassName;
        this.empty = Jamon.get();
    });

    beforeEach(function () {
        fixture.load('basic_elements.html');
        this.el = document.getElementById("id1");
        this.$el = Jamon.get(this.el);
        this.el2 = document.getElementById("id2");
        this.$el2 = Jamon.get(this.el2);
        this.el3 = document.getElementById("id3");
        this.$el3 = Jamon.get(this.el3);
        this.$els = Jamon.getAll("#" + this.el2.id + ", #" + this.el3.id);
    });

    afterEach(function () {
        fixture.cleanup();
    });

    describe("addClass()", function () {
        
        it("should throw reference error without arguments", function () {
            expect(calling(this.$el.addClass).on(this.$el).with()).to.throw(ReferenceError);
        });

        it("should throw type error with invalid type", function () {
            expect(calling(this.$el.addClass).on(this.$el).with(null)).to.throw(TypeError);
            expect(calling(this.$el.addClass).on(this.$el).with({})).to.throw(TypeError);
        });

        it("should not throw error with an empty string", function () {
            expect(calling(this.$el.addClass).on(this.$el).with("")).to.not.throw(Error);
        });
        
        it("should not throw error when called on an empty collection", function () {
            expect(calling(this.empty.addClass).on(this.empty).with("")).to.not.throw(Error);
        });

        it("should not create an empty class attribute with an empty string", function () {
            this.$el.addClass("");

            expect(this.el).to.not.have.attribute("class");
        });

        it("should add the class name to the element", function () {
            this.$el.addClass(this.newClass1);

            expect(this.el).to.have.class(this.newClass1);
        });

        it("should trim whitespace from the class name", function () {
            this.$el.addClass(" " + this.newClass1 + " ");

            expect(this.el).to.have.class(this.newClass1);
        });

        it("should keep the original class names of the element", function () {
            var originalClassNames = Array.prototype.slice.call(this.el2.classList);
            this.$el2.addClass(this.newClass1);

            for (let className of originalClassNames) {
                expect(this.el2).to.have.class(className);
            }
            expect(this.el2).to.have.class(this.newClass1);
        });

        it("should add space-separated class names to the element", function () {
            this.$el.addClass(this.newClass1 + " " + this.newClass2);

            expect(this.el).to.have.class(this.newClass1);
            expect(this.el).to.have.class(this.newClass2);
        });
        
        it("should work with class names with excess whitespace", function () {
            this.$el.addClass(" " + this.newClass1 + "  " + this.newClass2 + "   ");
            
            expect(this.el).to.have.class(this.newClass1);
            expect(this.el).to.have.class(this.newClass2);
            expect(this.el.classList).to.have.lengthOf(2);
        });

        it("shouldn't add an already existing class name", function () {
            this.el.className = this.newClass1;
            this.$el.addClass(this.newClass1);

            expect(this.el.className).to.equal(this.newClass1);
        });

        it("shouldn't add duplicate class names in one call", function () {
            this.$el.addClass(this.newClass1 + " " + this.newClass1);

            expect(this.el.className).to.equal(this.newClass1);
        });

        it("should add class names to multiple elements", function () {
            this.$els.addClass(this.newClass1);

            expect(this.el2).to.have.class(this.newClass1);
            expect(this.el3).to.have.class(this.newClass1);
        });

        it("should return the Jamón instance", function () {
            var returnValue = this.$el.addClass(this.newClass1);

            expect(returnValue).to.equal(this.$el);
        });
    });

    describe("removeClass()", function () {
        
        it("should throw reference error without arguments", function () {
            expect(calling(this.$el.removeClass).on(this.$el).with()).to.throw(ReferenceError);
        });

        it("should throw type error with invalid type", function () {
            expect(calling(this.$el.removeClass).on(this.$el).with(null)).to.throw(TypeError);
            expect(calling(this.$el.removeClass).on(this.$el).with({})).to.throw(TypeError);
        });

        it("should not throw error with an empty string", function () {
            expect(calling(this.$el.removeClass).on(this.$el).with("")).to.not.throw(Error);
        });
        
        it("should not throw error when called on an empty collection", function () {
            expect(calling(this.empty.removeClass).on(this.empty).with("")).to.not.throw(Error);
        });

        it("should not remove class attribute", function () {
            this.el.classList.add(this.newClass1);
            this.$el.removeClass(this.newClass1);

            expect(this.el).to.have.attribute("class");
        });

        it("should remove the class name from the element", function () {
            this.el.classList.add(this.newClass1);
            this.$el.removeClass(this.newClass1);

            expect(this.el).to.not.have.class(this.newClass1);
        });

        it("should trim whitespace from the class name", function () {
            this.el.classList.add(this.newClass1);
            this.$el.removeClass(" " + this.newClass1 + " ");

            expect(this.el).to.not.have.class(this.newClass1);
        });
        
        it("should remove space-separated class names from the element", function () {
            this.el.classList.add(this.newClass1, this.newClass2);
            this.$el.removeClass(this.newClass1 + " " + this.newClass2);

            expect(this.el).to.not.have.class(this.newClass1);
            expect(this.el).to.not.have.class(this.newClass2);
        });
        
        it("should work with class names with excess whitespace", function () {
            var originalClassNames = Array.prototype.slice.call(this.el2.classList);
            
            this.$el2.removeClass(" " + originalClassNames.join("   ") + "  ");
            
            expect(this.el2.classList).to.have.lengthOf(0);

        });

        it("should keep the original class names of the element", function () {
            var originalClassNames = Array.prototype.slice.call(this.el2.classList);
            var newClassNames;
            this.el2.classList.add(this.newClass1);
            this.$el2.removeClass(this.newClass1);

            expect(originalClassNames.length).to.equal(this.el2.classList.length);
            for (let className of originalClassNames) {
                expect(this.el2).to.have.class(className);
            }
        });

        it("shouldn't throw error on duplicate class names in one call", function () {
            var duplicateNames = this.newClass1 + " " + this.newClass1;
            this.el.classList.add(this.newClass1);

            expect(calling(this.$el.removeClass).on(this.$el).with(duplicateNames)).to.not.throw(Error);
        });

        it("should work on multiple elements", function () {
            
            this.el2.classList.add(this.newClass1);
            this.el3.classList.add(this.newClass1);
            this.$els.removeClass(this.newClass1);

            expect(this.el2).to.not.have.class(this.newClass1);
            expect(this.el3).to.not.have.class(this.newClass1);
        });

        it("should return the Jamón instance", function () {
            var returnValue = this.$el.removeClass("");

            expect(returnValue).to.equal(this.$el);
        });

    });
    
    describe("toggleClass()", function () {
        
        it("should throw reference error without arguments", function () {
            expect(calling(this.$el.toggleClass).on(this.$el).with()).to.throw(ReferenceError);
        });
        
        it("should throw type error with invalid type arguments", function () {
            expect(calling(this.$el.toggleClass).on(this.$el).with(null)).to.throw(TypeError);
            expect(calling(this.$el.toggleClass).on(this.$el).with({})).to.throw(TypeError);
        });
        
        it("should not throw error with an empty string argument", function () {
            expect(calling(this.$el.toggleClass).on(this.$el).with("")).to.not.throw(Error);
        });
        
        it("should not throw error when called on an empty collection", function () {
            expect(calling(this.empty.toggleClass).on(this.empty).with("")).to.not.throw(Error);
        });
        
        it("should remove an existing class name", function () {
            this.el.classList.add(this.newClass1);
            this.$el.toggleClass(this.newClass1);
            expect(this.el2).to.not.have.class(this.newClass1);
        });
        
        it("should add a nonexistent class name", function () {
            this.$el.toggleClass(this.newClass1);
            expect(this.el).to.have.class(this.newClass1);
        });
        
        it("should trim whitespace from the class name", function () {
            var whiteSpacedClass = "  " + this.newClass1 + "  ";
            this.$el.toggleClass(whiteSpacedClass);
            
            expect(this.el).to.have.class(this.newClass1);
            expect(this.el.className).to.not.include(whiteSpacedClass);
            
            this.$el.toggleClass(whiteSpacedClass);

            expect(this.el).to.not.have.class(this.newClass1);
        });
        
        it("should work with space-separated class names", function () {
            this.el.classList.add(this.newClass1);
            this.$el.toggleClass(this.newClass1 + " " + this.newClass2);
            
            expect(this.el).to.not.have.class(this.newClass1);
            expect(this.el).to.have.class(this.newClass2);
        });
        
        it("should work with class names with excess whitespace", function () {
            this.el.classList.add(this.newClass1);
            this.$el.toggleClass("  " + this.newClass1 + "   " + this.newClass2 + "  ");
            
            expect(this.el).to.not.have.class(this.newClass1);
            expect(this.el).to.have.class(this.newClass2);
        });
        
        it("should keep the original class names of the element", function () {
            this.el.classList.add(this.newClass1);
            this.$el.toggleClass(this.newClass2);
            
            expect(this.el).to.have.class(this.newClass1);
            
            this.$el.toggleClass(this.newClass2);
            
            expect(this.el).to.have.class(this.newClass1);
        });
        
        it("shouldn't throw error on duplicate class names in one call", function () {
            expect(calling(this.$el.toggleClass).on(this.$el).with(this.newClass1 + " " + this.newClass1)).to.not.throw(Error);
        });
        
        it("should work on multiple elements", function () {            
            this.$els.toggleClass(this.newClass1);

            expect(this.el2).to.have.class(this.newClass1);
            expect(this.el3).to.have.class(this.newClass1);
            
            this.$els.toggleClass(this.newClass1);

            expect(this.el2).to.not.have.class(this.newClass1);
            expect(this.el3).to.not.have.class(this.newClass1);
        });
        
        it("should return the Jamón instance", function () {
            var returnValue = this.$el.toggleClass("");

            expect(returnValue).to.equal(this.$el);
        });
    });
    
    describe("hasClass()", function () {
        
        it("should not throw error without arguments", function () {
            expect(calling(this.$el.hasClass).on(this.$el).with()).to.not.throw(Error);
        });
        
        it("should throw error with space character in argument", function () {
            expect(calling(this.$el.hasClass).on(this.$el).with(this.newClass1 + " ")).to.throw(Error);
        });
        
        it("should not throw error with an empty string argument", function () {
            expect(calling(this.$el.hasClass).on(this.$el).with("")).to.throw(Error);
        });
        
        it("should not throw error when called on an empty collection", function () {
            expect(calling(this.empty.hasClass).on(this.empty).with("")).to.not.throw(Error);
        });
        
        it("should return true for an existing class name", function () {
            this.el.classList.add(this.newClass1);
            
            expect(this.$el.hasClass(this.newClass1)).to.be.true;
        });
        
        it("should return false for a nonexisting class name", function () {
            expect(this.$el.hasClass(this.newClass1)).to.be.false;
        });
        
        it("should work on multiple elements", function () {            
            expect(calling(this.$els.hasClass).on(this.$els).with()).to.not.throw(Error);
        });
        
        it("should return the existence of the class name on the first element", function () {
            this.el3.classList.add(this.newClass1);
            
            expect(this.$els.hasClass(this.newClass1)).to.be.false;
            
            this.el2.classList.add(this.newClass2);
            
            expect(this.$els.hasClass(this.newClass2)).to.be.true;  
        });
    });
    
    describe("show()", function () {
        
        it("should not throw error when called on an empty collection", function () {
            expect(calling(this.empty.show).on(this.empty).with()).to.not.throw(Error);
        });
        
        it("should remove the hidden class name from the element", function () {
            this.el2.classList.add(this.hiddenClassName);
            this.$el2.show();
            
            expect(this.el2).to.not.have.class(this.hiddenClassName);
        });
        
        it("should work on multiple elements", function () {
            this.el2.classList.add(this.hiddenClassName);
            this.el3.classList.add(this.hiddenClassName);
            this.$els.show();
             
            expect(this.el2).to.not.have.class(this.hiddenClassName);
            expect(this.el3).to.not.have.class(this.hiddenClassName);
        });
        
        it("should return the Jamón instance", function () {
            var returnValue = this.$el.show();
            
            expect(returnValue).to.equal(this.$el);
        });
    });
    
    describe("hide()", function () {
        
        it("should not throw error when called on an empty collection", function () {
            expect(calling(this.empty.hide).on(this.empty).with()).to.not.throw(Error);
        });

        it("should add the hidden class name to the element", function () {
            this.$el2.hide();
            
            expect(this.el2).to.have.class(this.hiddenClassName);
        });
        
        it("should work on multiple elements", function () {
            this.$els.hide();
             
            expect(this.el2).to.have.class(this.hiddenClassName);
            expect(this.el3).to.have.class(this.hiddenClassName);
            
        });
        
        it("should return the Jamón instance", function () {
            var returnValue = this.$el.hide();
            
            expect(returnValue).to.equal(this.$el);
        });
    });
    
     describe("toggle()", function () {
        
        it("should not throw error when called on an empty collection", function () {
            expect(calling(this.empty.toggle).on(this.empty).with()).to.not.throw(Error);
        });

        it("should remove the hidden class name from the element", function () {
            this.el2.classList.add(this.hiddenClassName);
            this.$el2.toggle();
            
            expect(this.el2).to.not.have.class(this.hiddenClassName);
        });
        
        it("should add the hidden class name to the element", function () {
            this.$el2.hide();
            
            expect(this.el2).to.have.class(this.hiddenClassName);
        });
        
        it("should work on multiple elements", function () {
            this.el2.classList.add(this.hiddenClassName);
            this.$els.toggle();
             
            expect(this.el2).to.not.have.class(this.hiddenClassName);
            expect(this.el3).to.have.class(this.hiddenClassName);
        });
        
        it("should return the Jamón instance", function () {
             var returnValue = this.$el.toggle();
            
            expect(returnValue).to.equal(this.$el);
        });
    });
    
    describe("Jamon.hiddenClassName", function () {
        
        beforeEach(function () {
            Jamon.hiddenClassName = this.hiddenClassName;
        })
        
        it("should change the class name used by show()", function () {            
            Jamon.hiddenClassName = this.newClass1;
            this.el.classList.add(this.newClass1);
            this.$el.show();
            
            expect(this.el).to.not.have.class(this.newClass1);
        });
        
        it("should change the class name used by hide()", function () {
            Jamon.hiddenClassName = this.newClass1;
            this.$el.hide();
            
            expect(this.el).to.have.class(this.newClass1);
        });
        
        it("should change the class name used by toggle()", function () {
            Jamon.hiddenClassName = this.newClass1;
            this.$el.toggle();
            
            expect(this.el).to.have.class(this.newClass1);
            
            this.$el.toggle();
            
            expect(this.el).to.not.have.class(this.newClass1);
        });
    });
    
});


