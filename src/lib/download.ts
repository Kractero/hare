export function handleDownload(filetype: string, files: Array<string> | string, name?: string) {
    let blob;
	if (Array.isArray(files)) {
		blob = new Blob([files[0]], { type: `text/${filetype}` });
		urlObject(blob, 'Containerise (Container)');
		blob = new Blob([files[1]], { type: `text/${filetype}` });
		urlObject(blob, 'Containerise (Nation)');
	} else {
		blob = new Blob([files], { type: `text/${filetype}` });
		urlObject(blob, name);
	}
}

export function urlObject(blob, mode) {
	const url = window.URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = `${mode}.${
		['gotIssues', 'Login Sheet', 'junkDaJunk'].includes(mode) ? 'html' : 'txt'
	}`;
	link.click();
	window.URL.revokeObjectURL(url);
}
