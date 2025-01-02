// ==UserScript==
// @name         Banner Uploader
// @version      1.0
// @description  Banner blobbing
// @author       Kractero
// @match        https://*.nationstates.net/*page=banners*
// @grant        window.close
// ==/UserScript==

;(async function () {
	'use strict'

	const bannerURL = ''

	const openDatabase = () => {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open('HareStorage', 1)

			request.onupgradeneeded = e => {
				const db = e.target.result
				if (!db.objectStoreNames.contains('banners')) {
					db.createObjectStore('banners')
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

	const getBannerFromIndexedDB = (db, url) => {
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(['banners'], 'readonly')
			const store = transaction.objectStore('banners')
			const request = store.get(url)

			request.onsuccess = e => {
				resolve(e.target.result)
			}

			request.onerror = e => {
				reject('Error retrieving banner from IndexedDB: ' + e.target.errorCode)
			}
		})
	}

	const getBanner = async url => {
		const db = await openDatabase()
		let bannerBlob = await getBannerFromIndexedDB(db, url)

		if (!bannerBlob) {
			console.log(`Fetching and storing banner: ${url}`)
			const response = await fetch(url)
			bannerBlob = await response.blob()
			const transaction = db.transaction(['banners'], 'readwrite')
			const store = transaction.objectStore('banners')
			store.put(bannerBlob, url)
		} else {
			console.log('Banner retrieved from IndexedDB')
		}

		return bannerBlob
	}

	if (!bannerURL) {
		window.alert('Put a banner image link in line 13 please')
		return
	}

	const input = document.getElementById('banner__0_Primary')

	if (input && input.checked) {
		window.close()
	}

	if (document.querySelector('#banner__0 .custombanneruploadbox')) {
		document.querySelector('#banner__0 .custombanneruploadbox').style.display = 'block'
		const bannerBlob = await getBanner(bannerURL)

		const file = new File([bannerBlob], 'banner.png', { type: bannerBlob.type })

		const dataTransfer = new DataTransfer()
		dataTransfer.items.add(file)

		const fileInput = document.querySelector("input[name='file__0']")
		fileInput.files = dataTransfer.files

		document.querySelector("#banner__0 button[name='uploadbanner']").focus()
	} else {
		const label = document.querySelector("label[for='banner__0_Primary']")
		label.click()
		document.querySelector('#savebannersbuttonfloating').style.display = 'block'
		const button = document.querySelector("button[name='make_changes2']")
		button.focus()
	}
})()
