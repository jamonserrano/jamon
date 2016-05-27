describe("Property", function () {
	before(function () {
		fixture.setBase("test/fixtures");
		this.property = "disabled";
		this.customProperty = "customProperty";
		this.$empty = Jamon.get();
		this.content = "<div id=\"id5\">new content</div>";
	});

	beforeEach(function () {
		fixture.load("property_elements.html");
		
		this.input = document.getElementById("id1");
		this.$input = Jamon.get(this.input);
		
		this.el = document.getElementById("id3");
		this.$el = Jamon.get(this.el);
		
		this.el2 = document.getElementById("id4");
		this.$el2 = Jamon.get(this.el2);
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
		
		it("should remove the property when called with null", function () {
			this.input[this.customProperty] = true;		
			this.$input.prop(this.customProperty, null);
			
			expect(this.input[this.customProperty]).to.not.exist;
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
		
	describe("html()", function () {
		it("should return the html content", function () {
			var html = this.el.innerHTML
			expect(html).to.not.equal("");
			
			expect(this.$el.html()).to.equal(html);
		});
		
		it("should return empty string when the element is empty", function () {
			expect(this.$el2.html()).to.equal("");
		});

		it("should work on an empty collection", function () {
			expect(this.$empty.html()).to.be.undefined;
		});

		it("should work on multiple items", function () {
			var els = Jamon.getAll([this.el, this.el2]);
			
			expect(this.el.innerHTML).to.not.equal(this.el2.innerHTML);
			expect(els.html()).to.equal(this.el.innerHTML);
		});
	});
	
	describe("html(value)", function () {
		it("should set the html content", function () {
			this.$el.html(this.content);
			
			expect(this.el.innerHTML).to.equal(this.content);
		});
		
		it("calling with empty string should empty html content", function () {
			this.$el.html("");
			expect(this.el.innerHTML).to.equal("");
		});
		
		it("calling with null should empty html content", function () {
			this.$el.html(null);
			expect(this.el.innerHTML).to.equal("");
		});
		
		it("should work on an empty collection", function () {
			expect(calling(this.$empty.html).on(this.$empty).with(this.content)).to.not.throw(Error);
		});

		it("should work on multiple items", function () {
			var els = Jamon.getAll([this.el, this.el2]);
			
			expect(this.el.innerHTML).to.not.equal(this.el2.innerHTML);
			
			els.html(this.content);
			
			expect(this.el.innerHTML).to.equal(this.content);
			expect(this.el2.innerHTML).to.equal(this.content);
		});
		
		it("should return the Jamón instance", function () {
			expect(this.$el.html(this.content)).to.equal(this.$el);
		});
	});
	
	describe("text()", function () {
		it("should return the text content", function () {
			var text = this.el.textContent
			expect(text).to.not.equal("");
			
			expect(this.$el.text()).to.equal(text);
		});
		
		it("should return empty string when the element is empty", function () {
			var text = this.el2.textContent
			expect(text).to.equal("");
			
			expect(this.$el2.text()).to.equal(text);
		});

		it("should work on an empty collection", function () {
			expect(this.$empty.text()).to.be.undefined;
		});

		it("should work on multiple items", function () {
			var els = Jamon.getAll([this.el, this.el2]);
			
			expect(this.el.textContent).to.not.equal(this.el2.textContent);
			expect(els.text()).to.equal(this.el.textContent);
		});

	});
	
	describe("text(value)", function () {
		it("should set the text content", function () {
			this.$el.text(this.content);
			
			expect(this.el.textContent).to.equal(this.content);
		});
		
		it("calling with empty string should empty text content", function () {
			this.$el.text("");
			expect(this.el.textContent).to.equal("");
		});
		
		it("calling with null should empty text content", function () {
			this.$el.text(null);
			expect(this.el.textContent).to.equal("");
		});
		
		it("should work on an empty collection", function () {
			expect(calling(this.$empty.text).on(this.$empty).with(this.content)).to.not.throw(Error);
		});

		it("should work on multiple items", function () {
			var els = Jamon.getAll([this.el, this.el2]);
			
			expect(this.el.textContent).to.not.equal(this.el2.textContent);
			
			els.text(this.content);
			
			expect(this.el.textContent).to.equal(this.content);
			expect(this.el2.textContent).to.equal(this.content);
		});
		
		it("should return the Jamón instance", function () {
			expect(this.$el.text(this.content)).to.equal(this.$el);
		});

	});
	
});
