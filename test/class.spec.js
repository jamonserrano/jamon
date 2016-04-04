describe("Classes", function () {
    before(function () {
        fixture.setBase("test/fixtures");
    });

    beforeEach(function () {
        fixture.load('basic_elements.html');
        this.el = document.getElementById("id1");
        this.$el = $(this.el);
        this.el2 = document.getElementById("id2");
        this.$el2 = $(this.el2);
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

        it("should not create an empty class attribute with an empty string", function () {
            this.$el.addClass("");

            expect(this.el).to.not.have.attribute("class");
        });

        it("should add the class name to the element", function () {
            var className = "test1";
            this.$el.addClass(className);

            expect(this.el).to.have.class(className);
        });

        it("should trim whitespace from the class name", function () {
            var className = "test1";
            this.$el.addClass(" " + className + " ");

            expect(this.el).to.have.class(className);
        });

        it("should keep the original class names of the element", function () {
            var originalClassNames = Array.prototype.slice.call(this.el2.classList),
                newClassName = "new1";
            this.$el2.addClass(newClassName);

            for (let className of originalClassNames) {
                expect(this.el2).to.have.class(className);
            }
            expect(this.el2).to.have.class(newClassName);
        });

        it("should add space-separated class names to the element", function () {
            var className1 = "new1",
                className2 = "new2";
            this.$el.addClass(className1 + " " + className2);

            expect(this.el).to.have.class(className1);
            expect(this.el).to.have.class(className2);
        });

        it("shouldn't add an already existing class name", function () {
            var className = "new1";
            this.el.className = className;
            this.$el.addClass(className);

            expect(this.el.className).to.equal(className);
        });

        it("shouldn't add duplicate class names in one call", function () {
            var className = "new1";
            this.$el.addClass(className + " " + className);

            expect(this.el.className).to.equal(className);
        });

        it("should add class names to all elements", function () {
            var $els = $$("#id1, #id2"),
                className = "new1";
            $els.addClass(className);

            expect(this.el).to.have.class(className);
            expect(this.el).to.have.class(className);
        });

        it("should return the Jamón instance", function () {
            var returnValue = this.$el.addClass("new1");

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

        it("should not remove class attribute", function () {
            var className = "new1";
            this.el.classList.add(className);
            this.$el.removeClass(className);

            expect(this.el).to.have.attribute("class");
        });

        it("should remove the class name from the element", function () {
            var className = "new1";
            this.el.classList.add(className);
            this.$el.removeClass(className);

            expect(this.el).to.not.have.class(className);
        });

        it("should trim whitespace from the class name", function () {
            var className = "new1";
            this.el.classList.add(className);
            this.$el.removeClass(" " + className + " ");

            expect(this.el).to.not.have.class(className);
        });

        it("should keep the original class names of the element", function () {
            var originalClassNames = Array.prototype.slice.call(this.el2.classList),
                newClassNames,
                className = "new1";
            this.el2.classList.add(className);
            this.$el2.removeClass(className);

            expect(originalClassNames.length).to.equal(this.el2.classList.length);
            for (let className of originalClassNames) {
                expect(this.el2).to.have.class(className);
            }

        });

        it("should remove space-separated class names to the element", function () {
            var className1 = "new1",
                className2 = "new2";
            this.el.classList.add(className1, className2);
            this.$el.removeClass(className1 + " " + className2);

            expect(this.el).to.not.have.class(className1);
            expect(this.el).to.not.have.class(className2);
        });

        it("shouldn't throw error on duplicate class names in one call", function () {
            var className = "new1",
                duplicateNames = className + " " + className;
            this.el.classList.add(className);

            expect(calling(this.$el.removeClass).on(this.$el).with(duplicateNames)).to.not.throw(Error);
        });

        it("should remove class names from all elements", function () {
            var els = [this.el, this.el2],
                $els = $$(els),
                className = "new1";

            this.el.classList.add(className);
            this.el2.classList.add(className);
            $els.removeClass(className);

            expect(this.el).to.not.have.class(className);
            expect(this.el2).to.not.have.class(className);
        });

        it("should return the Jamón instance", function () {
            var returnValue = this.$el.removeClass("");

            expect(returnValue).to.equal(this.$el);
        });

    });
});
