describe("Globals", function () {
    before(function () {
        fixture.setBase("test/fixtures");
    });

    describe("Jamon", function () {
        
        it("should expose Jamon as a global variable", function () {
            expect(Jamon).to.exist;
        });

        it("Jamon should be a subclass of Array", function () {
            expect(Jamon.constructor).to.equal(Array.constructor);
        });

    });
    
    describe("$", function () {
        
        it("should exist as a global variable", function () {
            expect(window.$).to.exist;
        });
        
        it("should equal to Jamon.get", function () {
            expect(window.$).to.equal(Jamon.get);
        });

    });

    describe("$$", function () {
        
        it("should exist as a global variable", function () {
            expect(window.$$).to.exist;
        });
        
         it("should equal to Jamon.getAll", function () {
            expect(window.$$).to.equal(Jamon.getAll);
        });

    });

});
