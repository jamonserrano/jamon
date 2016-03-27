describe("Core", function () {
    describe("globals", function () {
        it("should expose Jamon as a global variable", function () {
            expect(Jamon).to.exist;
        });

        it("Jamon should be a subclass of Array", function () {
            expect(Jamon.constructor).to.equal(Array.constructor);
        });

        it("should provide the global variable $", function () {
            expect(window.$).to.exist;
            expect(window.$).to.equal(Jamon.$);
        });

        it("should provide the global variable $$", function () {
            expect(window.$$).to.exist;
            expect(window.$$).to.equal(Jamon.$$);
        });
    });

    describe("$", function () {
        before(function () {
            fixture.setBase("test/fixtures");
        });

        function addFixture () {
            fixture.load('basic_elements.html');
        }

        function removeFixture () {
            fixture.cleanup();
        }

        it("should work without arguments", function () {
            var result = $();

            expect(result).to.be.an.instanceof(Jamon);
            expect(result).to.have.lengthOf(0);
        });

        it("should work with a selector string", function () {
            addFixture();

            var selector = "#id1";
            var qSResult = document.querySelector(selector);
            var result = $(selector);

            expect(result).to.be.an.instanceof(Jamon);
            expect(result).to.have.lengthOf(1);
            expect(result[0]).to.equal(qSResult);

            removeFixture();
        });

        it("should return only one element", function () {
            addFixture();

            var result = $("div");
            var qSAResult = document.querySelectorAll("div")[0];

            expect(result).to.have.lengthOf(1);
            expect(result[0]).to.equal(qSAResult);

            removeFixture();
        });

        it("should work on the document element", function () {
            var result = $(document);

            expect(result).to.be.an.instanceof(Jamon);
            expect(result).to.have.lengthOf(1);
            expect(result[0]).to.equal(document);
        });

        it("should work on an element", function () {
            addFixture();

            var el = document.getElementById("id1");
            var result = $(el);

            expect(result).to.be.an.instanceof(Jamon);
            expect(result).to.have.lengthOf(1);
            expect(result[0]).to.equal(el);

            removeFixture();
        });

        it("should work on a text node", function () {
            var text = document.createTextNode("text");
            var result = $(text);

            expect(result).to.be.an.instanceof(Jamon);
            expect(result).to.have.lengthOf(1);
            expect(result[0]).to.equal(text);
        });

        it("should work on a Jamón instance", function () {
            var original = $();
            var result = $(original);

            expect(result).to.be.an.instanceof(Jamon);
            expect(result).to.equal(original);
        });
    });

    describe("$$", function () {
    });
});
