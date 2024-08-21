const textFiles = ['Transfer', 'Deck', 'Containerise']

export function handleDownload(name: string, files: string[] | string) {
	if (Array.isArray(files)) {
		downloadBlob(new Blob([files[0]], { type: "text/txt" }), 'Containerise (Nation).txt')
		downloadBlob(new Blob([files[1]], { type: "text/txt" }), 'Containerise (Container).txt')
	} else {
		const extension = textFiles.includes(name) ? 'txt' : 'html'
		downloadBlob(new Blob([files], { type: extension }), `${name}.${extension}`)
	}
}

function downloadBlob(blob: Blob, fileName: string) {
	const url = URL.createObjectURL(blob)
	const link = document.createElement('a')
	link.href = url
	link.download = fileName
	link.click()
	URL.revokeObjectURL(url)
}
