describe("Data", function () {
	before(function () {
		fixture.setBase("test/fixtures");
		this.$empty = Jamon.get();
		
		this.attribute = "jamon";
		this.value = "Jamón";
	});

	beforeEach(function () {
		fixture.load("basic_elements.html");
		
		this.el = document.getElementById("id1");
		this.$el = Jamon.get(this.el);
		this.el2 = document.getElementById("id2");
		this.$els = Jamon.getAll([this.el, this.el2]);
	});

	afterEach(function () {
		fixture.cleanup();
	});
		
	describe("data(name)", function () {
		it("should return the data-attribute value", function () {
			this.el.dataset[this.attribute] = this.value;
			
			expect(this.$el.data(this.attribute)).to.equal(this.value);
		});
		
		it("should return undefined when the data-attribute is missing", function () {
			expect(this.$el.data(this.attribute)).to.be.undefined;
		});

		it("should work on an empty collection", function () {
			expect(this.$empty.data(this.attribute)).to.be.undefined;
		});

		it("should work on multiple items", function () {
			this.el.dataset[this.attribute] = this.value;
			
			expect(this.$els.data(this.attribute)).to.equal(this.el.dataset[this.attribute]);
		});
	});
	
	describe("data(name, value)", function () {
		it("should set the data-attribute value", function () {
			this.$el.data(this.attribute, this.value);
			
			expect(this.el.dataset[this.attribute]).to.equal(this.value);
		});
				
		it("calling with null should remove the data-attribute", function () {
			this.el.dataset[this.attribute] = this.value;
			this.$el.data(this.attribute, null);
			
			expect(this.el.dataset[this.attribute]).to.equal(undefined);
		});

		it("should work on an empty collection", function () {
			expect(calling(this.$el.data).on(this.$el).with(this.attribute, this.value)).to.not.throw(Error);
		});

		it("should work on multiple items", function () {
			this.$els.data(this.attribute, this.value);
			
			for (var item of this.$els) {
				expect(item.dataset[this.attribute]).to.equal(this.value);
			}
		});
		
		it("should return the Jamón instance", function () {
			expect(this.$el.data(this.attribute, this.value)).to.equal(this.$el);
		});
	});

});