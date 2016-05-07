describe("Attributes", function () {
    before(function () {
        fixture.setBase("test/fixtures");
        this.empty = Jamon.get();
    });

    beforeEach(function () {
        fixture.load('inputs.html');
                
        this.inputs = Array.prototype.slice.call(document.querySelectorAll("input"));
        this.select = document.querySelector("select");
        this.textarea = document.querySelector("textarea");
        
        this.all = this.inputs.concat(this.select, this.textarea);
    });

    afterEach(function () {
        fixture.cleanup();
    });

    describe("val()", function () {
	    
        it("should return the value of the input", function () {
           for (const item of this.all) {
               expect(Jamon.get(item).val()).to.equal(item.value);
           }
        });
        
	});
});
