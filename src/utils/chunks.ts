//Function taken from burkino, many thanks!
export function chunk(text: string, maxBytes: number) {
	let buf = Buffer.from(text);
	const result: string[] = [];
	while (buf.length) {
		result.push(buf.slice(0, maxBytes).toString());
		buf = buf.slice(maxBytes);
	}
	return result;
}