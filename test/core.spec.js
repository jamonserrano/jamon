describe("Core", function () {
	before(function () {
		fixture.setBase("test/fixtures");
	});

	beforeEach(function () {
		fixture.load('basic_elements.html');
	});

	afterEach(function () {
		fixture.cleanup();
	});
	
	describe("Jamon", function () {
		it("should exist", function () {
			expect(Jamon).to.not.be.undefined; 
		});

		it("should be a subclass of Array", function () {
			expect(Array.isArray(new Jamon())).to.be.true;
		}); 
	});
	
	describe("Jamon.get", function () {
		
		it("should work without arguments", function () {
			var result = Jamon.get();

			expect(result).to.be.an.instanceof(Jamon);
			expect(result).to.have.lengthOf(0);
		});

		it("should work with a selector string", function () {
			var selector = "div";
			var qSResult = document.querySelector(selector);
			var result = Jamon.get(selector);

			expect(result).to.be.an.instanceof(Jamon);
			expect(result).to.have.lengthOf(1);
			expect(result[0]).to.equal(qSResult);
		});

		it("should work with the document element", function () {
			var result = Jamon.get(document);

			expect(result).to.be.an.instanceof(Jamon);
			expect(result).to.have.lengthOf(1);
			expect(result[0]).to.equal(document);
		});

		it("should work with an element", function () {
			var el = document.getElementById("id1");
			var result = Jamon.get(el);

			expect(result).to.be.an.instanceof(Jamon);
			expect(result).to.have.lengthOf(1);
			expect(result[0]).to.equal(el);
		});

		it("should work with a text node", function () {
			var text = document.createTextNode("text");
			var result = Jamon.get(text);

			expect(result).to.be.an.instanceof(Jamon);
			expect(result).to.have.lengthOf(1);
			expect(result[0]).to.equal(text);
		});

		it("should work with a Jamón instance", function () {
			var el1 = document.getElementById("id1");
			var el2 = document.getElementById("id2");
			
			var original = Jamon.getAll([el1, el2]);
			var result = Jamon.get(original);
			
			expect(result).to.have.lengthOf(1);
			expect(result[0]).to.equal(original[0]);
		});
		
		it("should work with an empty Jamón instance", function () {
			var original = new Jamon();
			var result = Jamon.get(original);

			expect(result).to.be.an.instanceof(Jamon);
			expect(result).to.have.lengthOf(0);
		});
		
		it("should work with a NodeList", function () {
			var nodeList = document.querySelectorAll("div");		   
			var result = Jamon.get(nodeList);

			expect(nodeList.length).to.be.above(0);
			expect(result).to.be.an.instanceof(Jamon);
			expect(result).to.have.lengthOf(1);
			expect(result[0]).to.equal(nodeList[0]);
		});
		
		it("should work with an empty NodeList", function () {
			var nodeList = document.querySelectorAll("#nonexistent");
			var result = Jamon.get(nodeList);
			
			expect(nodeList.length).to.equal(0);
			expect(result).to.be.an.instanceof(Jamon);
			expect(result).to.have.lengthOf(0);
		});

		it("should work with a HTMLCollection", function () {
			var htmlCollection = document.getElementsByTagName("div");
			var result = Jamon.get(htmlCollection);
			
			expect(htmlCollection.length).to.be.above(0);
			expect(result).to.be.an.instanceof(Jamon);
			expect(result).to.have.lengthOf(1);
			expect(result[0]).to.equal(htmlCollection[0]);
		});
		
		it("should work with an empty HTMLCollection", function () {
			var htmlCollection = document.getElementsByTagName("nonexistent");
			var result = Jamon.get(htmlCollection);
			
			expect(htmlCollection.length).to.equal(0); 
			expect(result).to.be.an.instanceof(Jamon);
			expect(result).to.have.lengthOf(0);		  
		});

		it("should work with an Array", function () {
			var arr = [1,2];
			var result = Jamon.get(arr);

			expect(result).to.be.an.instanceof(Jamon);
			expect(result).to.have.lengthOf(1);
			expect(result[0]).to.equal(arr[0]);
		});
		
		it("should work with an empty Array", function () {
			var arr = [];
			var result = Jamon.getAll(arr);

			expect(result).to.be.an.instanceof(Jamon);
			expect(result).to.have.lengthOf(0);
		});
	});

	describe("Jamon.getAll", function () {
		
		it("should work without arguments", function () {
			var results = Jamon.getAll();

			expect(results).to.be.an.instanceof(Jamon);
			expect(results).to.have.lengthOf(0);
		});

		it("should work with a selector string", function () {
			var selector = "div";
			var qSAResults = document.querySelectorAll(selector);
			var results = Jamon.getAll(selector);
			var length = results.length;
			var i = 0;

			expect(length).to.equal(qSAResults.length);
			for (; i < length; i++) {
				expect(results[i]).to.equal(qSAResults[i]);
			}
		});
		
		it("should work with a NodeList", function () {
			var nodeList = document.querySelectorAll("div");
			var results = Jamon.getAll(nodeList);
			var length = results.length;
			var i = 0;

			expect(results).to.be.an.instanceof(Jamon);
			expect(length).to.equal(nodeList.length);
			for (; i < length; i++) {
				expect(results[i]).to.equal(nodeList[i]);
			}
		});
		
		it("should work with an empty NodeList", function () {
			var nodeList = document.querySelectorAll("#nonexistent");
			var results = Jamon.getAll(nodeList);
			
			expect(nodeList.length).to.equal(0);
			expect(results).to.be.an.instanceof(Jamon);
			expect(results).to.have.lengthOf(0);
		});


		it("should work with a HTMLCollection", function () {
			var htmlCollection = document.getElementsByTagName("div");
			var results = Jamon.getAll(htmlCollection);
			var length = results.length;
			var i = 0;

			expect(results).to.be.an.instanceof(Jamon);
			expect(length).to.equal(htmlCollection.length);
			for (; i < length; i++) {
				expect(results[i]).to.equal(htmlCollection[i]);
			}
		});
		
		it("should work with an empty HTMLCollection", function () {
			var htmlCollection = document.getElementsByTagName("nonexistent");
			var results = Jamon.get(htmlCollection);
			
			expect(htmlCollection.length).to.equal(0); 
			expect(results).to.be.an.instanceof(Jamon);
			expect(results).to.have.lengthOf(0);		  
		});

		it("should work with an Array", function () {
			var arr = [1,2];
			var results = Jamon.getAll(arr);
			var length = results.length;
			var i = 0;

			expect(results).to.be.an.instanceof(Jamon);
			expect(length).to.equal(arr.length);
			for (; i < length; i++) {
				expect(results[i]).to.equal(arr[i]);
			}
		});
		
		it("should work with an empty Array", function () {
			var arr = [];
			var results = Jamon.getAll(arr);

			expect(results).to.be.an.instanceof(Jamon);
			expect(results).to.have.lengthOf(0);
		});

		it("should work with a Jamón instance", function () {
			var original = Jamon.getAll();
			var results = Jamon.getAll(original);

			expect(results).to.be.an.instanceof(Jamon);
			expect(results).to.equal(original);
		});
		
		it("should work with an empty Jamón instance", function () {
			var original = new Jamon();
			var results = Jamon.get(original);

			expect(results).to.be.an.instanceof(Jamon);
			expect(results).to.have.lengthOf(0);
		});
	});
});
