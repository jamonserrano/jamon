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
		
		this.els = [this.el, this.el3]
		this.$els = Jamon.getAll(this.els);
	});

	afterEach(function () {
		fixture.cleanup();
	});
	
	describe("findOne()", function () {
		it("should return a Jamon instance", function () {
			expect(this.$el.findOne("div")).to.be.an.instanceOf(Jamon);
		});
		
		it("should work on an empty collection", function () {
			expect(calling(this.$empty.findOne).on(this.$empty).with()).to.not.throw(Error);
		});
		
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
			expect(result).to.be.empty;
		});
		
		it("should find only one element", function () {
			var result = this.$el.findOne("div");
			
			expect(result).to.be.an.instanceOf(Jamon);
			expect(result).to.have.lengthOf(1);
			expect(result[0]).to.equal(this.el2);
		});
		
		it("should only find a descendant of the element", function () {
			var result = this.$el.findOne(".class3");
			
			expect(result).to.be.empty;
			
			result = this.$el.findOne("#id4");
			
			expect(result).to.be.empty;
		});
		
		it("should not find the element itself", function () {
			var result = this.$el.findOne("#" + this.el.id);
			
			expect(result).to.be.empty;
		});
		
		it("should work on multiple elements", function () {
			var result = this.$els.findOne("#" + this.el4.id);
			
			expect(result).to.have.lengthOf(1);
			expect(result[0]).to.equal(this.el4);
		});
	});
	
	describe("findAll()", function () {
		it("should return a Jamon instance", function () {
			expect(this.$el.findAll("div")).to.be.an.instanceOf(Jamon);
		});
		
		it("should work on an empty collection", function () {
			expect(calling(this.$empty.findAll).on(this.$empty).with()).to.not.throw(Error);
		});
		
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
			expect(results).to.be.empty;
		});
		
		it("should find multiple elements", function () {
			var results = this.$el.findAll("div");
			
			expect(results).to.be.an.instanceOf(Jamon);
			expect(results).to.have.length.above(1);
		});
				
		it("should not find the element itself", function () {
			var results = this.$el.findAll("#" + this.el.id);
			
			expect(results).to.be.an.instanceOf(Jamon);
			expect(results).to.be.empty;
		});
		
		it("should work on multiple elements", function () {
			var results = this.$els.findAll(".class5");
			
			expect(results).to.have.lengthOf(3);
		});
	});

	describe("parent()", function () {
		it("should return a Jamón instance", function () {
			expect(this.$el.parent()).to.be.an.instanceOf(Jamon);
		});

		it("should work on an empty collection", function () {
			expect(calling(this.$empty.parent).on(this.$empty).with()).to.not.throw(Error);
		});

		it("should return the parent of the element", function () {
			var parent = this.$el.parent();
			
			expect(parent).to.have.lengthOf(1);
			expect(parent[0]).to.equal(this.el.parentElement);
		});

		it("should return the parents of multiple elements", function () {
			var elements = [this.el2, this.el4]
			var $haveDistinctParents = Jamon.getAll(elements);
			var parents = $haveDistinctParents.parent();
			
			expect(parents).to.have.lengthOf(elements.length);
			expect(parents).to.include(this.el2.parentElement);
			expect(parents).to.include(this.el4.parentElement);
		});

		it("should not return duplicate elements", function () {
			var parents = this.$els.parent();
			
			expect(parents).to.have.lengthOf(1);
			expect(parents[0]).to.equal(this.el.parentElement);
		});

		it("should return an empty instance when the parent is null", function () {
			var $document = Jamon.get(document);
			var parent = $document.parent();
			
			expect(parent).to.be.empty;
		});

		it("should return an empty collection when there is no parent", function () {
			var detachedElement = Jamon.get(document.createElement("div"));
			var parent = detachedElement.parent();
			
			expect(parent).to.be.empty;
		});
	});

	describe("children()", function () {
		it("should return a Jamón instance", function () {
			expect(this.$el.children()).to.be.an.instanceOf(Jamon);
		});

		it("should work on an empty collection", function () {
			expect(calling(this.$empty.children).on(this.$empty).with()).to.not.throw(Error);
		});


		it("should return the children of the element", function () {
			var $children = this.$el3.children();
			
			expect($children).to.have.lengthOf(this.el3.children.length);
			for (var child of $children) {
				expect(child.parentElement).to.equal(this.el3);
			}
		});

		it("should return the children of multiple elements", function () {
			var $children = this.$els.children();
			var children = [];
			for (var el of this.els) {
				children.push(...(el.children));
			}
			var length = children.length;
			
			expect($children).to.have.lengthOf(length);
			for (var child of $children) {
				expect(children).to.include(child);
			}
		});

		it("should return an empty collection when there are no children", function () {
			expect(this.$el4.children()).to.be.empty;
		});
	});

	describe("closest()", function () {
		it("should return a Jamón instance", function () {
			expect(this.$el2.closest("body")).to.be.an.instanceOf(Jamon);
		});

		it("should work on an empty collection", function () {
			expect(calling(this.$empty.closest).on(this.$empty).with("body")).to.not.throw(Error);
		});

		it("should return the element itself if there's a match", function () {
			var element = this.el2.firstElementChild;
			var $element = Jamon.get(element);
			var result = $element.closest("div");
			
			expect(result).to.have.lengthOf(1);
			expect(result[0]).to.equal(element);
		});

		it("should return the closest ancestor if there's a match", function () {
			var element = this.el2.firstElementChild;
			var $element = Jamon.get(element);
			var result = $element.closest("[id^=id]");
			
			expect(result).to.have.lengthOf(1);
			expect(result[0]).to.equal(element.parentElement);
		});

		it("should work on multiple elements", function () {
			var elements = [this.el2, this.el4]
			var $elements = Jamon.getAll(elements);
			var results = $elements.closest("div");
			
			expect(results).to.have.lengthOf(elements.length);
			expect(results).to.include(this.el2);
			expect(results).to.include(this.el4);
		});

		it("should not return duplicate elements", function () {
			var results = this.$els.closest("body");
			
			expect(results).to.have.lengthOf(1);
			expect(results[0]).to.equal(document.body);
		});

		it("should return an empty instance when the element doesn't have a 'closest' method", function () {
			var $document = Jamon.get(document);
			var result = $document.closest("div");
			
			expect(result).to.be.an.instanceOf(Jamon);
			expect(result).to.be.empty;
		});

		it("should return an empty collection when there is no match", function () {
			var detachedElement = Jamon.get(document.createElement("div"));
			var parent = detachedElement.parent();
			
			expect(parent).to.be.empty;
		});
	});
});
