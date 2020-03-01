
module.exports = (results, filesNumber) => {
// Numero de links
	const totalLinks = results.data.length;
	// Unique
	const uniqueLinks = [];
	const repeatedLinks = [];
	results.data.forEach((element) => {
		const value = element.href;
		if (!repeatedLinks.includes(value)) {
			if (uniqueLinks.includes(value)) {
				const index = uniqueLinks.indexOf(value);
				uniqueLinks.splice(index, 1);
				repeatedLinks.push(value);
			} else {
				uniqueLinks.push(value);
			}
		}
	});

	// Concat stats a results
	results.stats = {
		Files: filesNumber,
		Total: totalLinks,
		Unique: uniqueLinks.length,
	};
	// Broken
	let failStatusCounter = 0;
	if (results.data[0].status) {
		const reducer = (accumulator, currentValue) => {
			if (currentValue.status === 'Fail') {
				return accumulator + 1;
			}
			return accumulator;
		};
		failStatusCounter = results.data.reduce(reducer, 0);
		// Concat Broken a results
		results.stats.Broken = failStatusCounter;
	}

	return results;
};
