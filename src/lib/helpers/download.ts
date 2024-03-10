export function handleDownload(filetype: string, files: Array<string> | string, name?: string) {
	let blob;
	if (Array.isArray(files)) {
		blob = new Blob([files[0]], { type: `text/${filetype}` });
		urlObject(blob, 'Containerise (Nation)');
		blob = new Blob([files[1]], { type: `text/${filetype}` });
		urlObject(blob, 'Containerise (Container)');
	} else {
		blob = new Blob([files], { type: `text/${filetype}` });
		urlObject(blob, name);
	}
}

export function urlObject(blob: Blob | MediaSource, mode: string | undefined) {
	const url = window.URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = `${mode}.${
		(mode === "Transfer" || mode === "Deck" || mode?.includes('Containerise')) ? 'txt' : 'html'
	}`;
	link.click();
	window.URL.revokeObjectURL(url);
}
