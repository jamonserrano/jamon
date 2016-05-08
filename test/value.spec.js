describe("Value", function () {
	before(function () {
		fixture.setBase("test/fixtures");

		this.empty = Jamon.get();
		this.newValue = "newValue";
		this.getValueForType = function (type) {
			if (type === "color") {
				newValue = "#ffcc00";
			} else if (type === "date") {
				newValue = "2016-05-08"
			} else if (type === "datetime-local") {
				newValue = "2016-05-08T12:23:34";
			} else if (type === "month") {
				newValue = "2016-05";
			} else if (type === "number" || type === "range") {
				newValue = "50";
			} else if (type === "time") {
				newValue = "12:23:34";
			} else if (type === "week") {
				newValue = "2016-W04";
			} else if (type === "select-one") {
				newValue = "1";
			} else {
				newValue = this.newValue;
			}
			return newValue;
		}
	});

	beforeEach(function () {
		fixture.load('inputs.html');

		this.inputs = Array.prototype.slice.call(document.querySelectorAll("input"));
		this.select = document.querySelector("select");
		this.textarea = document.querySelector("textarea");

		this.all = this.inputs.concat(this.select, this.textarea);
	});

	afterEach(function () {
		fixture.cleanup();
	});

	describe("val()", function () {

		it("should work with undefined values", function () {
			for (const item of this.all) {
				expect(Jamon.get(item).val()).to.equal(item.value);
			}
		});

		it("should work with defined values", function () {
			for (const item of this.all) {
				var newValue = this.getValueForType(item.type);
				item.value = newValue;
				expect(Jamon.get(item).val()).to.equal(item.value);
			}
		});

		it("should work on an empty collection", function () {
			expect(this.empty.val()).to.be.undefined;
		});

		it("should work on multiple items", function () {
			var inputs = Jamon.getAll(this.inputs);
			this.inputs[0].value = this.newValue;
			expect(inputs.val()).to.equal(this.newValue);
		});

	});

	describe("val(value)", function () {

		it("should set the value of the input", function () {
			var newValue;
			var type;

			for (const item of this.all) {
				var newValue = this.getValueForType(item.type);
				Jamon.get(item).val(newValue);
				expect(item.value).to.equal(newValue);
			}
		});

		it("should work on an empty collection", function () {
			expect(this.empty.val("something")).to.equal(this.empty);
		});

		it("should work on multiple items", function () {
			var inputs = Array.prototype.slice.call(document.querySelectorAll("input[type=text], input[type=hidden]"));
			var results = Jamon.getAll(inputs);

			expect(results.length).to.be.above(1);

			results.val(this.newValue);

			for (var item of inputs) {
				expect(item.value).to.equal(this.newValue);
			}
		});

		it("should return the Jamón instance", function () {
			var results = Jamon.get("input[type=text]");

			expect(results.val(this.newValue)).to.equal(results);
		});
	});
});
