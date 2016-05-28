describe("Attributes", function () {
	before(function () {
		fixture.setBase("test/fixtures");
		this.$empty = Jamon.get();
	});

	beforeEach(function () {
		fixture.load("property_elements.html");
		
		this.input = document.getElementById("id1");
		this.$input = Jamon.get(this.input);
		
		this.attribute = "type";
		this.value = "hidden";
	});

	afterEach(function () {
		fixture.cleanup();
	});
	
	describe("attr(name)", function () {
		it("should return the attribute value", function () {
			expect(this.$input.attr(this.attribute)).to.equal(this.input.getAttribute(this.attribute));
		});
		
		it("should return undefined when the attribute is missing", function () {
			expect(this.$input.attr("fakeAttribute")).to.be.undefined;
		});

		it("should work on an empty collection", function () {
			expect(this.$empty.attr(this.attribute)).to.be.undefined;
		});

		it("should work on multiple items", function () {
			let inputs = Jamon.getAll("input");
			
			expect(inputs).to.have.lengthOf(2);
			expect(inputs.attr(this.attribute)).to.equal(this.input.getAttribute(this.attribute));
		});
	});
	
	describe("attr(name, value)", function () {
		it("should set the attribute value", function () {
			var actualValue = String(this.value);
			expect(this.input.getAttribute(this.attribute)).to.not.equal(actualValue);
			this.$input.attr(this.attribute, this.value);
			
			expect(this.input.getAttribute(this.attribute)).to.equal(actualValue);
		});
		
		it("should create a new attribute if there was none", function () {
			var attribute = "tabIndex";
			var value = 5;
			expect(this.input.hasAttribute(attribute)).to.be.false;
			
			this.$input.attr("tabIndex", value);
			
			expect(this.input.getAttribute(attribute)).to.equal(String(value));
		});
		
		it("calling with null should remove the attribute", function () {
			var attribute = "tabIndex";
			this.input.setAttribute(attribute, "5");
			this.$input.attr(attribute, null);
			
			expect(this.input.hasAttribute(attribute)).to.be.false;
		});

		it("should work on an empty collection", function () {
			expect(calling(this.$empty.attr).on(this.$empty).with(this.attribute, this.value)).to.not.throw(Error);
		});

		it("should work on multiple items", function () {
			let inputs = Jamon.getAll("input");	
			expect(inputs).to.have.length.above(1);
			
			for (var input of inputs) {
				expect(input.getAttribute(this.attribute)).to.not.equal(this.value);
			}
			
			inputs.attr(this.attribute, this.value);
			
			for (var input of inputs) {
				expect(input.getAttribute(this.attribute)).to.equal(this.value);
			}
		});
		
		it("should return the Jamón instance", function () {
			expect(this.$input.attr(this.attribute, this.value)).to.equal(this.$input);
		});
	});

});