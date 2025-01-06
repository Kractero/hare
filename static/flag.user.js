// ==UserScript==
// @name         Flag Uploader
// @version      1.0
// @description  Flag blobbing
// @author       Kractero
// @match        https://*.nationstates.net/*page=upload_flag*
// @grant        window.close
// ==/UserScript==

;(async function () {
	'use strict'

	const flagUrl = ''

	const openDatabase = () => {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open('HareStorage', 2)

			request.onupgradeneeded = e => {
				const db = e.target.result
				if (!db.objectStoreNames.contains('nsflags')) {
					db.createObjectStore('nsflags')
				}
			}

			request.onsuccess = e => {
				resolve(e.target.result)
			}

			request.onerror = e => {
				reject('IndexedDB error: ' + e.target.errorCode)
			}
		})
	}

	const getFlagFromIndexedDB = (db, url) => {
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(['nsflags'], 'readonly')
			const store = transaction.objectStore('nsflags')
			const request = store.get(url)

			request.onsuccess = e => {
				resolve(e.target.result)
			}

			request.onerror = e => {
				reject('Error retrieving flag from IndexedDB: ' + e.target.errorCode)
			}
		})
	}

	const getFlag = async url => {
		const db = await openDatabase()
		let flagBlob = await getFlagFromIndexedDB(db, url)

		if (!flagBlob) {
			console.log(`Fetching and storing flag: ${url}`)
			const response = await fetch(url)
			flagBlob = await response.blob()
			const transaction = db.transaction(['nsflags'], 'readwrite')
			const store = transaction.objectStore('nsflags')
			store.put(flagBlob, url)
		} else {
			console.log('Flag retrieved from IndexedDB')
		}

		return flagBlob
	}

	if (!flagUrl) {
		window.alert('Put a flag image link in line 13 please')
		return
	}

	if (document.querySelector("input[name='file']")) {
		const flagBlob = await getFlag(flagUrl)

		const file = new File([flagBlob], 'flag.png', { type: flagBlob.type })

		const dataTransfer = new DataTransfer()
		dataTransfer.items.add(file)

		const fileInput = document.querySelector("input[name='file']")
		fileInput.files = dataTransfer.files

		const reader = new FileReader()
		reader.onload = function (e) {
			document.querySelector('#previewimage').src = e.target.result
			document.querySelector('#previewripple').src = ''
		}
		reader.readAsDataURL(flagBlob)

		document.querySelector('.primary').focus()
	} else {
		const label = document.querySelector("label[for='banner__0_Primary']")
		label.click()
		document.querySelector('#savebannersbuttonfloating').style.display = 'block'
		const button = document.querySelector("button[name='make_changes2']")
		button.focus()
	}
})()
