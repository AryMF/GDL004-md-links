module.exports = calculateStats = (results) => {
	//Numero de links
	let totalLinks = results.data.length;

	//Unique
	let uniqueLinks = [];
	let repeatedLinks = [];
	results.data.forEach(element => {
		let value = element.href;
		if(!repeatedLinks.includes(value)){
			if(uniqueLinks.includes(value)){
				let index = uniqueLinks.indexOf(value);
				uniqueLinks.splice(index, 1);
				repeatedLinks.push(value);
			} else {
				uniqueLinks.push(value);
			}
		}
	});

	//Concat stats a results
	results['stats'] = {
		'Total': totalLinks,
		'Unique': uniqueLinks.length
	}
	//Broken
	let failStatusCounter = 0;
	if (results.data[0].status){
		const reducer = (accumulator, currentValue) => {
			if(currentValue.status === 'Fail') {
				return accumulator + 1;
			} else {
				return accumulator;
			}
		}
		failStatusCounter = results.data.reduce(reducer, 0);
		//Concat Broken a results
		results.stats['Broken'] = failStatusCounter;
	}

	return results;
};
