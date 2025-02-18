// ==UserScript==
// @name        Simple Card Switcher
// @match       https://*.nationstates.net/*generated_by=Hare*
// @grant       window.close
// @version     1.5
// @author      Kractero
// @description Kill me
// ==/UserScript==

const ua = ''
const password = ''

const url = new URL(window.location.href)
const strippedUrl = url.origin + url.pathname
const searchParams = url.searchParams

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
			if (loggedNation !== nation) {
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
			const switchButton = document.createElement('button')
			switchButton.id = 'switchButton'
			switchButton.textContent = 'Switch'
			switchButton.style.marginTop = '10px'
			switchButton.autofocus = true

			switchButton.addEventListener('keyup', async () => {
				switchButton.disabled = true
				const response = await fetch(
					`${strippedUrl}?nation=${nation}&password=${password}&logging_in=1&script=Shitty_Card_Switcher__by_Kractero__usedBy_${ua}&userclick=${Date.now()}`,
					{
						method: 'GET',
						credentials: 'include',
					}
				)

				const redirUrl = new URL(response.url)
				let redirStrippedUrl = redirUrl.origin + redirUrl.pathname

				// readd necessary query parametters for functionality/other userscripts
				if (searchParams.has('open_loot_box')) redirStrippedUrl += '?open_lootbox=1'
				if (searchParams.has('giftto')) redirStrippedUrl += `?giftto=${searchParams.get('giftto')}`
				if (searchParams.has('mode') && searchParams.has('amount'))
					redirStrippedUrl += `?mode=${searchParams.get('mode')}&amount=${searchParams.get('amount')}`

				redirStrippedUrl += redirStrippedUrl.includes('?')
					? `&generated_by=${searchParams.get('generated_by')}`
					: `?generated_by=${searchParams.get('generated_by')}`

				// if redirected the card is junked and you can close
				if (redirStrippedUrl.includes('junkcard')) {
					window.close()
				}

			        document.addEventListener('keydown', (event) => {
			          if (event.key === "Enter") {
			            window.location.href = redirStrippedUrl
			          }
			        })
				// below is probably illegal after some observation
				// window.location.href = redirStrippedUrl
			})
			switchButton.focus()
			document.body.prepend(switchButton)
		}
	}

	if (searchParams.has('open_lootbox')) {
		document.querySelector('.lootboxbutton').focus()
	}
}
