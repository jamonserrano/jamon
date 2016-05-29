describe("Traversal", function () {
	before(function () {
		fixture.setBase("test/fixtures");
		this.$empty = Jamon.get();
	});

	beforeEach(function () {
		fixture.load("traversal_elements.html");
		
		this.el = document.getElementById("id1");
		this.$el = Jamon.get(this.el);
		this.el2 = document.getElementById("id2");
		this.$el2 = Jamon.get(this.el2);
		this.el3 = document.getElementsByClassName("class3")[0];
		this.$el3 = Jamon.get(this.el3);
		this.el4 = document.getElementById("id4");
		this.$el4 = Jamon.get(this.el4);
		
		this.$els = Jamon.getAll([this.el, this.el3]);
	});

	afterEach(function () {
		fixture.cleanup();
	});
	
	describe("findOne", function () {
		it("should work on an element with id", function () {
			var result = this.$el.findOne("#" + this.el2.id);
			
			expect(result).to.be.an.instanceOf(Jamon);
			expect(result[0]).to.equal(this.el2);
		});
		
		it("should work on an element without id", function () {
			var result = this.$el3.findOne("#" + this.el4.id);
			
			expect(result).to.be.an.instanceOf(Jamon);
			expect(result[0]).to.equal(this.el4);
		});
								
		it("should return an empty Jamón instance when there is no result", function () {
			var result = this.$el.findOne("invalid");
			
			expect(result).to.be.an.instanceOf(Jamon);
			expect(result).to.have.lengthOf(0);
		});
		
		it("should find only one element", function () {
			var result = this.$el.findOne("div");
			
			expect(result).to.be.an.instanceOf(Jamon);
			expect(result).to.have.lengthOf(1);
			expect(result[0]).to.equal(this.el2);
		});
		
		it("should only find a descendant of the element", function () {
			var result = this.$el.findOne(".class3");
			
			expect(result).to.have.lengthOf(0);
			
			result = this.$el.findOne("#id4");
			
			expect(result).to.have.lengthOf(0);
		});
		
		it("should not find the element itself", function () {
			var result = this.$el.findOne("#" + this.el.id);
			
			expect(result).to.have.lengthOf(0);
		});
		
		it("should work on multiple elements", function () {
			var result = this.$els.findOne("#" + this.el4.id);
			
			expect(result).to.have.lengthOf(1);
			expect(result[0]).to.equal(this.el4);
		});
	});
	
	describe("findAll", function () {
		it("should work on an element with id", function () {
			var results = this.$el.findAll("> .class5");
			
			expect(results).to.be.an.instanceOf(Jamon);
			expect(results).to.have.lengthOf(2);
			for (var item of results) {
				expect(item.parentElement).to.equal(this.el);
			}
		});
		
		it("should work on an element without id", function () {
			var results = this.$el3.findAll("> div");
			
			expect(results).to.be.an.instanceOf(Jamon);
			expect(results).to.have.lengthOf(2);
			for (var item of results) {
				expect(item.parentElement).to.equal(this.el3);
			}
		});
		
		it("should return an empty Jamón instance when there is no result", function () {
			var results = this.$el.findAll("invalid");
			
			expect(results).to.be.an.instanceOf(Jamon);
			expect(results).to.have.lengthOf(0);
		});
		
		it("should find multiple elements", function () {
			var results = this.$el.findAll("div");
			
			expect(results).to.be.an.instanceOf(Jamon);
			expect(results).to.have.length.above(1);
		});
				
		it("should not find the element itself", function () {
			var results = this.$el.findAll("#" + this.el.id);
			
			expect(results).to.be.an.instanceOf(Jamon);
			expect(results).to.have.lengthOf(0);
		});
		
		it("should work on multiple elements", function () {
			var results = this.$els.findAll(".class5");
			
			expect(results).to.have.lengthOf(3);
		});
	});
});
