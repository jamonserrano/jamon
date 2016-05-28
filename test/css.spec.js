describe("Attributes", function () {
	before(function () {
		fixture.setBase("test/fixtures");
		this.$empty = Jamon.get();
		this.property = "lineHeight";
		this.cssProperty = "line-height";
		this.value = "3px";
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
	
	describe("css(name)", function () {
				
		it("should return the computed style with a kebab-case name", function () {
			expect(this.$el.css(this.cssProperty)).to.equal(window.getComputedStyle(this.el).getPropertyValue(this.cssProperty));
		});
		
		it("should return the computed style with a camelCase name", function () {
			expect(this.$el.css(this.property)).to.equal(window.getComputedStyle(this.el).getPropertyValue(this.cssProperty));

		});
				
		it("should work on an empty collection", function () {
			expect(this.$empty.css(this.property)).to.be.undefined;
		});
		
		it("should return the computed style of the first item of the collection", function () {
			this.el.style[this.property] = this.value;
			
			expect(window.getComputedStyle(this.el).getPropertyValue(this.cssProperty)).to.not.equal(
				window.getComputedStyle(this.el2).getPropertyValue(this.cssProperty)
			);
			
			expect(this.$els.css(this.property)).to.equal(window.getComputedStyle(this.el).getPropertyValue(this.cssProperty));
		});
		
	});
	
	describe("css(name, value)", function () {
		
		it("should set the style attribute with a kebab-case name", function () {			
			this.$el.css(this.cssProperty, this.value);
			
			expect(this.el.style[this.property]).to.equal(this.value);
		});
		
		it("should set the style attribute with a camelCase name", function () {			
			this.$el.css(this.property, this.value);
			
			expect(this.el.style[this.property]).to.equal(this.value);

		});
				
		it("should work on an empty collection", function () {
			expect(calling(this.$empty.css).on(this.$empty).with(this.property, this.value)).to.not.throw(Error);
		});
		
		it("should set the style attribute on multiple items", function () {
			this.$els.css(this.property, this.value);
			
			for (var item of this.$els) {
				expect(item.style[this.property]).to.equal(this.value);
			}
		});
		
		it("should return the Jamón collection", function () {
			expect(this.$el.css(this.property, this.value)).to.equal(this.$el);
		});

	});
});