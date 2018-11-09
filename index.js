let alfy = require('alfy');

function* resultIntoTitle(result) {
	let name = result.displayName
	yield name
	let ext = result.extension
	if (ext) {
		yield `(x${ext})`
	}
	let email = result.username
	if (email) {
		yield `[${email}]`
	}
}

function* resultIntoSubtitle(result) {
	let room = ''
	if (result.building) {
		room = `${result.building}`
		if (result.room) {
			room += ` ${result.room}`
		}
		yield room
	}

	let depts =	result.departments.map(d => d.name).join(', ')
	if (depts) {
		yield depts
	}

	let title = result.displayTitle
	yield title
}

async function main() {
	let q = alfy.input;

	let resp = await alfy.fetch('https://www.stolaf.edu/directory/search', {
		json: true,
		query: { format: 'json', query: q },
	})

	let items = resp.results.map(x => ({
		title: [...resultIntoTitle(x)].join(' '),
		subtitle: [...resultIntoSubtitle(x)].join(' - '),
		arg: `https://www.stolaf.edu/directory/search?email=${x.username}`,
	}))

	alfy.output(items)
}

main()
