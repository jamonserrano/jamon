describe("Classes", function () {
    describe("addClass()", function () {
        beforeEach(function () {
            window.el = $("#id1");
        });
        afterEach(function () {
            document.getElementById("id1").removeAttribute("class");
        });
        it("should throw error without arguments", function () {
            expect(el.addClass).to.throw(Error);
        });
        it("should not throw error with an empty string");
        it("should not create an empty class attribute with an empty string");
        it("should add the class name to the element");
        it("should add the class name to the element");
        it("should keep the original class names of the element")
        it("should add space-separated class names to the element");
        it("shouldn't add an already existing class name");
        it("shouldn't add duplicate class names in one call");
        it("should add class names to all elements");
        it("should return the Jamón instance");
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
