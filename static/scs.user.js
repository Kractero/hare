// ==UserScript==
// @name        Simple Card Switcher
// @match       https://*.nationstates.net/*generated_by=Hare*
// @grant       window.close
// @version     1.81
// @author      Kractero
// @description Kill me
// ==/UserScript==

const ua = ''
const password = ''

if (!ua || !password) {
	alert('Set UA or password in the userscript')
	return
}

const url = new URL(window.location.href)
const searchParams = url.searchParams
const separator = url.searchParams.toString() ? '&' : '?'

const regex = /(?:container=([^/]+)|nation=([^/]+))/
const match = url.pathname.match(regex)

const nation = match ? match[1] || match[2] : null

handler()

function handler() {
	let switchNation = false

	if (url.href.includes('generated_by=Hare')) {
		// if the nation is logged in (on a non template_none page),
		// but the nation doesn't match the one in the url, switch
		if (document.querySelector('#loggedin')) {
			const loggedNation = document.body.getAttribute('data-nname')
			if (loggedNation !== nation.replace(' ', '_').toLowerCase()) {
				switchNation = true
			}
		}
		// if the url contains gotIssues (for gotIssues) and no issue, switch
		if (url.href.includes('gotIssues') && url.href.includes('dilemma') && !document.querySelector('.dilemmapaper')) {
			switchNation = true
		}
		// if the url contains junkdajunk and junk value is zero, there are two reasons:
		// 1) you already junked the card and don't own it anymore
		// 2) you are on the wrong nation
		// This will assume the second, switch
		if (url.href.toLowerCase().includes('junkdajunk') && Number(document.body.textContent) === 0) {
			switchNation = true
		} else if (url.href.toLowerCase().includes('junkdajunk')) {
			window.close()
		}

		if (switchNation === true) {
			// for query selecting on other scripts
			const notice = document.createElement('div')
			notice.id = 'switching'
			notice.style.display = 'none'
			document.body.appendChild(notice)

			if (document.getElementById('loginbox')) {
				document.querySelector('#loginbox').style.display = 'block'
				document.querySelector('#loginbox > form input[name=nation]').value = nation
				document.querySelector('#loginbox > form input[name=password]').value = password

				document.addEventListener('keyup', function onKeyUp(event) {
					if (event.key === 'Enter') {
						// set the form action to tell the form to send the login data to the relevant page, this has the benefit of landing back on the right page
						document.querySelector('#loginbox > form').action =
							`${url}${separator}script=Shitty_Card_Switcher__by_Kractero__usedBy_${ua}&userclick=${Date.now()}`
						document.querySelector('#loginbox > form button[name=submit]').click()
						document.removeEventListener('keyup', onKeyUp)
					}
				})
			} else {
				const loginForm = document.createElement('form')
				loginForm.method = 'POST'

				const loggingInInput = document.createElement('input')
				loggingInInput.name = 'logging_in'
				loggingInInput.value = '1'
				loggingInInput.type = 'hidden'

				const nationInput = document.createElement('input')
				nationInput.name = 'nation'
				nationInput.value = nation

				const passwordInput = document.createElement('input')
				passwordInput.name = 'password'
				passwordInput.type = 'password'
				passwordInput.value = password

				const submitButton = document.createElement('button')
				submitButton.type = 'submit'
				submitButton.value = 'Login'
				submitButton.textContent = 'Login'

				loginForm.append(loggingInInput, nationInput, passwordInput, submitButton)

				document.addEventListener('keyup', function onKeyUp(event) {
					if (event.key === 'Enter') {
						// set the form action to tell the form to send the login data to the relevant page, this has the benefit of landing back on the right page
						loginForm.action = `${url}${separator}script=Shitty_Card_Switcher__by_Kractero__usedBy_${ua}&userclick=${Date.now()}`
						loginForm.submit()
						document.removeEventListener('keyup', onKeyUp)
					}
				})

				document.body.prepend(loginForm)
			}
		}
	}

	if (searchParams.has('open_loot_box')) {
		document.querySelector('.lootboxbutton').focus()
	}
}
