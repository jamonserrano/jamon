describe("Dimensions", function () {
	before(function () {
		fixture.setBase("test/fixtures");
		this.$empty = Jamon.get();
	});

	beforeEach(function () {
		fixture.load("basic_elements.html");
		
		this.el = document.getElementById("id1");
		this.$el = Jamon.get(this.el);
		this.el2 = document.getElementById("id2");
		this.$el2 = Jamon.get(this.el2);
		
		this.els = [this.el, this.el2]
		this.$els = Jamon.getAll(this.els);
	});

	afterEach(function () {
		fixture.cleanup();
	});
	
	describe("width()", function () {
		it("should return a number", function () {
			expect(this.$el.width()).to.be.a("number");
		});
		
		it("should work on an empty collection", function () {
			expect(this.$empty.width()).to.be.undefined;
		});

		it("should work on the document", function () {
			expect($(document).width()).to.be.undefined;
		});
		
		it("should return the width of the element", function () {
			this.el.style.width = "300px";
			expect(this.$el.width()).to.equal(this.el.getBoundingClientRect().width);
		});
										
		it("should work on multiple elements", function () {
			this.el.style.width = "100px";
			this.el2.style.width = "300px";
			
			expect(this.el.getBoundingClientRect().width).to.not.equal(this.el2.getBoundingClientRect().width);
			expect(this.$els.width()).to.equal(this.el.getBoundingClientRect().width);
		});
	});

	describe("height()", function () {
		it("should return a number", function () {
			expect(this.$el.height()).to.be.a("number");
		});
		
		it("should work on an empty collection", function () {
			expect(this.$empty.height()).to.be.undefined;
		});

		it("should work on the document", function () {
			expect($(document).height()).to.be.undefined;
		});
		
		it("should return the height of the element", function () {
			this.el.style.height = "300px";
			
			expect(this.$el.height()).to.equal(this.el.getBoundingClientRect().height);
		});
										
		it("should work on multiple elements", function () {
			this.el.style.height = "100px";
			this.el2.style.height = "300px";
			
			expect(this.el.getBoundingClientRect().height).to.not.equal(this.el2.getBoundingClientRect().height);
			expect(this.$els.height()).to.equal(this.el.getBoundingClientRect().height);
		});
	});

});
