describe("Classes", function () {
    describe("addClass()", function () {
        before(function () {
            fixture.setBase("test/fixtures");
        });

        beforeEach(function () {
            fixture.load('basic_elements.html');
            this.$el = $("#id1");
            this.el = this.$el[0];
            this.$el2 = $("#id2");
        });

        afterEach(function () {
            fixture.cleanup();
        });

        it("should throw reference error without arguments", function () {
            expect(calling(this.$el.addClass).with()).to.throw(ReferenceError);
        });

        it("should throw type error with invalid type", function () {
            expect(calling(this.$el.addClass).with(null)).to.throw(TypeError);
            expect(calling(this.$el.addClass).with({})).to.throw(TypeError);
        });

        it("should not throw error with an empty string", function () {
            expect(calling(this.$el.addClass).with("")).to.not.throw(Error);
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
            var original1 = "original1",
                original2 = "original2",
                className = "test1";
            this.el.classList.add(original1, original2);
            this.$el.addClass(className);

            expect(this.el).to.have.class(original1);
            expect(this.el).to.have.class(original2);
            expect(this.el).to.have.class(className);
        });

        it("should add space-separated class names to the element", function () {
            var className1 = "test1",
                className2 = "test2";
            this.$el.addClass(className1 + " " + className2);

            expect(this.el).to.have.class(className1);
            expect(this.el).to.have.class(className2);
        });

        it("shouldn't add an already existing class name", function () {
            var className = "test1";
            this.el.className = className;
            this.$el.addClass(className);

            expect(this.el.className).to.equal(className);
        });

        it("shouldn't add duplicate class names in one call", function () {
            var className = "test1";
            this.$el.addClass(className + " " + className);

            expect(this.el.className).to.equal(className);
        });

        it("should add class names to all elements", function () {
            var $els = $$("#id1, #id2"),
                className = "test1";
            $els.addClass(className);

            expect(this.el).to.have.class(className);
            expect(this.el).to.have.class(className);
        });

        it("should return the Jamón instance", function () {
            var returnValue = this.$el.addClass("test1");

            expect(returnValue).to.equal(this.$el);
        });
    });

    describe("removeClass()", function () {
    });
});
