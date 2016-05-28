describe("Utils", function () {		
	describe("Jamon.create", function () {
		it("should return a Jamón instance", function () {
			var result = Jamon.create("a");
			expect(result).to.be.an.instanceOf(Jamon);
			expect(result).to.have.lengthOf(1);
		});
		
		it("should create an element with the provided tag", function () {
			var tagName = "a";
			var result = Jamon.create(tagName);
			
			expect(result[0].tagName).to.equal(tagName.toUpperCase());
		});

		it("should add properties", function () {
			var innerHTML = "Jamón";
			var href = "http://www.example.com/";
			var result = Jamon.create("a", {innerHTML, href});
			
			expect(result[0].innerHTML).to.equal(innerHTML);
			expect(result[0].href).to.equal(href);
		});
	});
	
	describe("items()", function () {
		beforeEach(function () {
			this.el = document.createElement("a");
			this.el2 = document.createElement("a");
			this.$els = Jamon.getAll([this.el, this.el2]);
		});
		
		it("should return an iterable", function () {
			expect(this.$els.items()[Symbol.iterator]).to.be.a.function;	
		});
		
		it("should wrap the elements in Jamón instances", function () {
			var index = 0;
			
			for (var item of this.$els.items()) {
				expect(item).to.be.an.instanceOf(Jamon);
				expect(item).to.have.lengthOf(1);
				expect(item[0]).to.equal(this.$els[index++]);
			}
		});
	});
});
