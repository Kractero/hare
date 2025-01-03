// ==UserScript==
// @name         NsIssueCompactorRandTest
// @version      1.0
// @namespace    dithpri.RCES
// @description  Hide everything except issue buttons and focus on a random option. Also stores nation and remaining issues in local storage.
// @author       dithpri
// @noframes
// @match        https://www.nationstates.net/*page=show_dilemma*
// @grant        window.close
// @run-at       document-end
// ==/UserScript==

/*
 * Copyright (c) 2019-2020 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
 */

;(function () {
	const queryString = window.location.search
	const urlParams = new URLSearchParams(queryString)
	const remainingIssues = urlParams.get('remainingIssues')
	if (remainingIssues) localStorage.setItem('ns_remainingIssues', remainingIssues)

	const issuebtns = document.querySelectorAll('button.button.big.icon.approve')
	if (issuebtns.length > 0) {
		document.querySelector('p.dilemmadismissbox > button.big.icon.remove.danger').disabled = true
		const chosenButtonNumber = 0 // Always choose the first button
		issuebtns[chosenButtonNumber].classList.add('rces-chosen')
		document.addEventListener('keyup', function (ev) {
			if (ev.key != 'Enter' || ev.repeat || issuebtns[chosenButtonNumber].style.display == 'none') {
				ev.preventDefault()
				return
			}
			document.querySelectorAll('button.button.big.icon').forEach(function (el) {
				el.style.display = 'none'
			})
			issuebtns[chosenButtonNumber].click()
		})
	}
})()
