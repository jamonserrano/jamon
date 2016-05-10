describe("Property", function () {
	before(function () {
		fixture.setBase("test/fixtures");
	});

	beforeEach(function () {
		fixture.load('property_elements.html');
		this.input = document.getElementById("id1");
		this.$input = Jamon.get(this.input);
		this.property = "disabled";
		this.customProperty = "customProperty";
		this.$empty = Jamon.get();
	});

	afterEach(function () {
		fixture.cleanup();
	});

	describe("prop(name)", function () {
		it("should return the property value", function () {
			expect(this.$input.prop(this.property)).to.be.false;
			
			this.input[this.property] = true;

			expect(this.$input.prop(this.property)).to.be.true;
			
			this.input[this.property] = this.property;

			expect(this.$input.prop(this.property)).to.be.true;
		});
		
		it("should return undefined when the property is missing", function () {
			expect(this.$input.prop("fakeProperty")).to.be.undefined;
		});

		it("should work on an empty collection", function () {
			expect(this.$empty.prop(this.property)).to.be.undefined;
		});

		it("should work on multiple items", function () {
			this.input[this.property] = true;
			
			expect(Jamon.getAll("#id1, #id2").prop(this.property)).to.equal(this.input[this.property]);
		});

	});

	describe("prop(name, value)", function () {

		it("should set the property value", function () {
			this.$input.prop(this.property, true);
			
			expect(this.input[this.property]).to.be.true;
			
			this.$input.prop(this.property, this.property);
			
			expect(this.input[this.property]).to.be.true;
		});

		it("should create a new property if there was none", function () {
			var value = "newValue";
			
			expect(this.input[this.customProperty]).to.not.exist;
			
			this.$input.prop(this.customProperty, value);
			
			expect(this.input[this.customProperty]).to.exist;
			expect(this.input[this.customProperty]).to.equal(value);
		});
		
		it("should work on an empty collection", function () {
			expect(calling(this.$empty.prop).on(this.$empty).with(this.property, true)).to.not.throw(Error);
		});

		it("should work on multiple items", function () {
			var input2 = document.getElementById("id2");
			
			expect(this.input[this.property]).to.be.false;
			expect(input2[this.property]).to.be.false;
			
			Jamon.getAll("#id1, #id2").prop(this.property, true);
			
			expect(this.input[this.property]).to.be.true;
			expect(input2[this.property]).to.be.true;
		});
				
		it("should return the Jamón instance", function () {
			expect(this.$input.prop(this.property, true)).to.equal(this.$input);
		});
		
	});
	
	describe("prop(name, null)", function () {
		
		it("should delete the property when called with null", function () {
			this.input[this.customProperty] = true;		
			this.$input.prop(this.customProperty, null);
			
			expect(this.input[this.customProperty]).to.not.exist;
		});
		
	});
	
	describe("html()", function () {
		
	});
	
	describe("html(value)", function () {
		
	});
	
	describe("text(value)", function () {
		
	});
	
	describe("text(value)", function () {
		
	});
});