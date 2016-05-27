describe("Attributes", function () {
	before(function () {
		fixture.setBase("test/fixtures");
		this.$empty = Jamon.get();
	});

	beforeEach(function () {
		fixture.load("basic_elements.html");
		
		this.input = document.getElementById("id1");
		this.$input = Jamon.get(this.input);
	});

	afterEach(function () {
		fixture.cleanup();
	});
	
	describe("css(name)", function () {
		
		it("should work with a kebab-case name");
		
		it("should work with a camelCase name");
				
		it("should work on an empty collection");
		
		it("should work on multiple items");
		
	});
	
	describe("css(name, value)", function () {
		
		it("should work with a kebab-case name");
		
		it("should work with a camelCase name");
				
		it("should work on an empty collection");
		
		it("should work on multiple items");
		
		it("should return the Jamón collection");

	});
	
	describe("css({name: value})", function () {
		
		it("should work with objects");
		
		it("should work with multiple properties");
		
		it("should work with a kebab-case name");
		
		it("should work with a camelCase name");
				
		it("should work on an empty collection");
		
		it("should work on multiple items");
		
		it("should return the Jamón collection");

	});

});