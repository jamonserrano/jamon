describe("Core", function () {
    before(function () {
        fixture.setBase("test/fixtures");
    });

    function addFixture () {
        fixture.load('basic_elements.html');
    }

    function removeFixture () {
        fixture.cleanup();
    }
    
    describe("Jamon", function () {
       it("should be a subclass of Array", function () {
           expect(new Jamon()).to.be.an.instanceof(Array);
       }); 
    });
    
    describe("Jamon.get", function () {
        
        it("should work without arguments", function () {
            var result = Jamon.get();

            expect(result).to.be.an.instanceof(Jamon);
            expect(result).to.have.lengthOf(0);
        });

        it("should work with a selector string", function () {
            addFixture();

            var selector = "div";
            var qSResult = document.querySelector(selector);
            var result = Jamon.get(selector);

            expect(result).to.be.an.instanceof(Jamon);
            expect(result).to.have.lengthOf(1);
            expect(result[0]).to.equal(qSResult);

            removeFixture();
        });

        it("should work on the document element", function () {
            var result = Jamon.get(document);

            expect(result).to.be.an.instanceof(Jamon);
            expect(result).to.have.lengthOf(1);
            expect(result[0]).to.equal(document);
        });

        it("should work on an element", function () {
            addFixture();

            var el = document.getElementById("id1");
            var result = Jamon.get(el);

            expect(result).to.be.an.instanceof(Jamon);
            expect(result).to.have.lengthOf(1);
            expect(result[0]).to.equal(el);

            removeFixture();
        });

        it("should work on a text node", function () {
            var text = document.createTextNode("text");
            var result = Jamon.get(text);

            expect(result).to.be.an.instanceof(Jamon);
            expect(result).to.have.lengthOf(1);
            expect(result[0]).to.equal(text);
        });

        it("should work on a Jamón instance", function () {
            addFixture();
            var original = Jamon.get();
            var result = Jamon.get(original);

            //expect(result).to.be.an.instanceof(Jamon);
            //expect(result).to.equal(original.slice(0,1));
            removeFixture();
        });

        it ("should throw an error with invalid parameter", function () {
            expect(calling($).with({})).to.throw(TypeError);
        });
    });

    describe("Jamon.getAll", function () {
        
        it("should work without arguments", function () {
            var results = Jamon.getAll();

            expect(results).to.be.an.instanceof(Jamon);
            expect(results).to.have.lengthOf(0);
        });

        it("should work with a selector string", function () {
            addFixture();

            var selector = "div";
            var qSAResults = document.querySelectorAll(selector);
            var results = Jamon.getAll(selector);

            expect(results).to.be.an.instanceof(Jamon);

            removeFixture();
        });

        it("should return multiple elements", function () {
            addFixture();

            var selector = "div";
            var qSAResults = document.querySelectorAll(selector);
            var results = Jamon.getAll(selector);
            var length = results.length;
            var i = 0;

            expect(length).to.equal(qSAResults.length);
            for (; i < length; i++) {
                expect(results[i]).to.equal(qSAResults[i]);
            }

            removeFixture();
        });

        it("should work with a NodeList", function () {
            addFixture();

            var nodeList = document.querySelectorAll("div");
            var results = Jamon.getAll(nodeList);
            var length = results.length;
            var i = 0;

            expect(results).to.be.an.instanceof(Jamon);
            expect(length).to.equal(nodeList.length);
            for (; i < length; i++) {
                expect(results[i]).to.equal(nodeList[i]);
            }

            removeFixture();
        });

        it("should work with a HTMLCollection", function () {
            addFixture();

            var htmlCollection = document.getElementsByTagName("div");
            var results = Jamon.getAll(htmlCollection);
            var length = results.length;
            var i = 0;

            expect(results).to.be.an.instanceof(Jamon);
            expect(length).to.equal(htmlCollection.length);
            for (; i < length; i++) {
                expect(results[i]).to.equal(htmlCollection[i]);
            }

            removeFixture();
        });

        it("should work with an Array", function () {
            addFixture();
            var arr = Array.from(document.getElementsByTagName("div"));
            var results = Jamon.getAll(arr);
            var length = results.length;
            var i = 0;

            expect(results).to.be.an.instanceof(Jamon);
            expect(length).to.equal(arr.length);
            for (; i < length; i++) {
                expect(results[i]).to.equal(arr[i]);
            }

            removeFixture();
        })

        it("should work on a Jamón instance", function () {
            var original = Jamon.getAll();
            var result = Jamon.getAll(original);

            expect(result).to.be.an.instanceof(Jamon);
            expect(result).to.equal(original);
        });

        it ("should throw an error with invalid parameter", function () {
            expect(calling($).with({})).to.throw(TypeError);
        });
    });
});
