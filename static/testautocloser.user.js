// ==UserScript==
// @name         test autocloser
// @version      1.1
// @author		 Kractero
// @match        *://*/*autoclose=1
// @match        https://*.nationstates.net/*page=enact_dilemma*
// @exclude      https://*.nationstates.net/*page=show_dilemma*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nationstates.net
// @grant        window.close
// ==/UserScript==

;(function () {
	'use strict'

	const remainingIssues = localStorage.getItem('ns_remainingIssues')?.split(',') || []

	if (remainingIssues.length > 0) {
		const handleKeyUp = function (ev) {
			if (ev.key === 'Enter' && !ev.repeat) {
				// Remove the event listener after it is triggered
				document.removeEventListener('keyup', handleKeyUp)

				const nextIssue = remainingIssues.shift()
				const updatedRemainingIssues = remainingIssues.join(',')

				if (updatedRemainingIssues) {
					localStorage.setItem('ns_remainingIssues', updatedRemainingIssues)
				} else {
					localStorage.removeItem('ns_remainingIssues')
				}

				const nation = document.querySelector('body').getAttribute('data-nname')
				const baseUrl = `https://www.nationstates.net/container=${nation}/nation=${nation}/page=show_dilemma/dilemma=${nextIssue}/template-overall=none`
				const newUrl = updatedRemainingIssues
					? `${baseUrl}?remainingIssues=${updatedRemainingIssues}&generated_by=Hare_gotIssues__author_main_nation_Kractero__usedBy_${nation}`
					: `${baseUrl}?generated_by=Hare_gotIssues__author_main_nation_Kractero__usedBy_${nation}`

				window.location.href = newUrl
			}
		}

		document.addEventListener('keyup', handleKeyUp)
	} else {
		window.close()
	}
})()
