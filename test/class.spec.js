describe("Classes", function () {
    describe("addClass()", function () {
        beforeEach(function () {
            window.el = document.getElementById("id1");
            window.$el = $("#id1");

            window.el2 = document.getElementById("id2");
        });
        afterEach(function () {
            el.removeAttribute("class");
            el2.removeAttribute("class");
        });

        it("should throw reference error without arguments", function () {
            expect(calling($el.addClass).withArgs()).to.throw(ReferenceError);
        });

        it("should throw type error with invalid type", function () {
            expect(calling($el.addClass).withArgs(null)).to.throw(TypeError);
            expect(calling($el.addClass).withArgs({})).to.throw(TypeError);
        });

        it("should not throw error with an empty string", function () {
            expect(calling($el.addClass).withArgs("")).to.not.throw(Error);
        });

        it("should not create an empty class attribute with an empty string", function () {
            $el.addClass("");

            expect(el).to.not.have.attribute("class");
        });

        it("should add the class name to the element", function () {
            var className = "test1";
            $el.addClass(className);

            expect(el).to.have.class(className);
        });

        it("should trim whitespace from the class name", function () {
            var className = "test1";
            $el.addClass(" " + className + " ");

            expect(el).to.have.class(className);
        });

        it("should keep the original class names of the element", function () {
            var original1 = "original1",
                original2 = "original2",
                className = "test1";
            el.classList.add(original1, original2);
            $el.addClass(className);

            expect(el).to.have.class(original1);
            expect(el).to.have.class(original2);
            expect(el).to.have.class(className);
        });

        it("should add space-separated class names to the element", function () {
            var className1 = "test1",
                className2 = "test2";
            $el.addClass(className1 + " " + className2);

            expect(el).to.have.class(className1);
            expect(el).to.have.class(className2);
        });

        it("shouldn't add an already existing class name", function () {
            var className = "test1";
            el.className = className;
            $el.addClass(className);

            expect(el.className).to.equal(className);
        });

        it("shouldn't add duplicate class names in one call", function () {
            var className = "test1";
            $el.addClass(className + " " + className);

            expect(el.className).to.equal(className);
        });

        it("should add class names to all elements", function () {
            var $els = $$("#id1, #id2"),
                className = "test1";
            $els.addClass(className);

            expect(el).to.have.class(className);
            expect(el).to.have.class(className);
        });

        it("should return the Jamón instance", function () {
            var returnValue = $el.addClass("test1");

            expect(returnValue).to.equal($el);
        });
    });

    describe("removeClass()", function () {
        it("should not throw error without arguments");
        it("should not throw error with an empty string");
        it("should remove the class name from the element");
        it("should keep the other class names of the element")
        it("should remove space-separated class names to the element");
        it("should remove duplicate class names");
        it("should remove class names from all elements");
        it("should return the Jamón instance");
    });
});
