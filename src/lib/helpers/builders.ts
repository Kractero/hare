const textFiles = ['Transfer', 'Deck', 'Containerise']

export function handleDownload(name: string, files: string[] | string) {
	if (Array.isArray(files)) {
		downloadBlob(new Blob([files[0]], { type: 'text/txt' }), 'Containerise (Nation).txt')
		downloadBlob(new Blob([files[1]], { type: 'text/txt' }), 'Containerise (Container).txt')
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

export const htmlContent = (
	content: { url: string; tableText: string; linkStyle?: string }[] | string,
	name: string
) => {
	let counterReset = false
	return `
      <html>
      <head>
      <style>
      ${
				name === 'Gold Retriever'
					? style
					: `
      td.createcol p {
        padding-left: 10em;
      }

      a {
        text-decoration: none;
        color: black;
      }

      a:visited {
        color: grey;
      }

      table {
        border-collapse: collapse;
        display: table-cell;
        max-width: 100%;
        border: 1px solid darkorange;
      }

      tr, td {
        border-bottom: 1px solid darkorange;
      }

      td p {
        padding: 0.5em;
      }

      tr:hover {
        background-color: lightgrey;
      }

      @media (prefers-color-scheme: dark) {
        html {
          background-color: black;
        }
        h2 {
          color: rgb(145, 23, 76);
        }
        a, p, span {
          color: rgb(232, 211, 162);
        }
        a:visited {
          color: rgb(145, 23, 76);
        }
        table, tr, td {
          border: 1px solid rgb(51, 0, 111);
        }
      }
      `
			}
      </style>
      </head>
      <body>
      ${
				Array.isArray(content)
					? `      <h2>${name}</h2>
      <p>Progress: <span id="remaining">1</span>/${content.length}</p>
      <button
        id="openNextLink"
        type="button"
        disabled
        style="cursor: not-allowed;"
      >
        Open Next Link
      </button>`
					: ''
			}

      <table>
      ${
				Array.isArray(content)
					? content
							.map((obj, i) => {
								let counter = i + 1
								if (!counterReset) {
									counter = ['open_loot_box', 'separate', 'jdj=view', 'gift=1'].some(condition =>
										obj.url.includes(condition)
									)
										? 1
										: i + 1
									counterReset = true
								}
								return `
                  <tr>
                    <td><p>${counter}</p></td>
                    <td><p><a style="${obj.linkStyle ? obj.linkStyle : ''}" target="_blank" href="${obj.url}">${obj.tableText}</a></p></td>
                  </tr>`
							})
							.join('')
					: content
			}

      </table>
      <script>
      ${
				name === 'RCES' || name === 'Gold Retriever'
					? script
					: `
      const button = document.getElementById('openNextLink')
      const linkElements = document.querySelectorAll('table tr td a')

      const openedLinks = JSON.parse(localStorage.getItem('openedLinks')) || []
      let links = Array.from(linkElements)
        .map(el => el.href)
        .filter(link => !openedLinks.includes(link))

      linkElements.forEach(link => {
        if (openedLinks.includes(link.getAttribute('href'))) {
          const linkElement = document.querySelector(\`a[href='\${link}']\`)
          if (linkElement) {
            linkElement.closest('tr').remove()
          }
        }
      })

      let counter = openedLinks.length

      const updateProgress = () => {
        document.querySelector('#remaining').textContent = counter
      }

      const updateButtonState = () => {
        button.disabled = links.length === 0
        button.style.cursor = links.length === 0 ? 'not-allowed' : 'pointer'
      }

      updateProgress()
      updateButtonState()

      button.addEventListener('keyup', e => {
        if (e.key !== 'Enter' || links.length === 0) return
        const link = links.shift() // Remove the first link
        openedLinks.push(link) // Track opened link
        localStorage.setItem('openedLinks', JSON.stringify(openedLinks))
        window.open(link, '_blank')
        counter++
        updateProgress()
        updateButtonState()
        const linkElement = document.querySelector(\`a[href='\${link}']\`)
        if (linkElement) {
          linkElement.closest('tr').remove()
        }
      })

      button.addEventListener('click', e => {
        if (e.pointerType === 'mouse' && links.length > 0) {
          const link = links.shift()
          openedLinks.push(link)
          localStorage.setItem('openedLinks', JSON.stringify(openedLinks))
          window.open(link, '_blank')
          counter++
          updateProgress()
          updateButtonState()
          const linkElement = document.querySelector(\`a[href='\${link}']\`)
          if (linkElement) {
            linkElement.closest('tr').remove()
          }
        }
      })

      document.querySelectorAll('td').forEach(function (el) {
        el.addEventListener('click', function (e) {
          if (e.pointerType === 'mouse') {
            const row = el.parentNode
            row.parentNode.removeChild(row)
            openedLinks.push(el.querySelector('a').getAttribute('href'))
            localStorage.setItem('openedLinks', JSON.stringify(openedLinks))
            counter++
            updateProgress()
            updateButtonState()
          }
        })
      })
        `
			}
      ${name === 'Gold Retriever' ? sort : ''}
      </script>
      </body>
      </html>
      `
}

export const racContent = (content: string, name: string) => {
	return `
      <html>
      <head>
      <style>
      ${
				name === 'Gold Retriever'
					? style
					: `
      td.createcol p {
        padding-left: 10em;
      }

      a {
        text-decoration: none;
        color: black;
      }

      a:visited {
        color: grey;
      }

      table {
        border-collapse: collapse;
        display: table-cell;
        max-width: 100%;
        border: 1px solid darkorange;
      }

      tr, td {
        border-bottom: 1px solid darkorange;
      }

      td p {
        padding: 0.5em;
      }

      tr:hover {
        background-color: lightgrey;
      }

      @media (prefers-color-scheme: dark) {
        html {
          background-color: black;
        }
        a, p {
          color: rgb(232, 211, 162);
        }
        a:visited {
          color: rgb(145, 23, 76);
        }
        table, tr, td {
          border: 1px solid rgb(51, 0, 111);
        }
      }
      `
			}
      </style>
      </head>
      <body>
      <table>
      ${content}
      </table>
      <script>
      ${script}
      ${name === 'Gold Retriever' ? sort : ''}
      </script>
      </body>
      </html>
      `
}

const sort = `
  const sortableColumns = document.querySelectorAll('.sort');
  sortableColumns.forEach(col => {
      col.addEventListener('click', () => {
          const table = document.querySelector('table');
          const columnIndex = Array.from(col.parentNode.cells).indexOf(col);

          const rows = Array.from(table.rows).slice(1);
          const isNumeric = columnIndex >= 1 && columnIndex <= 4;
          const currentOrder = col.getAttribute('data-order');
          const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
          rows.sort((a, b) => {
              const aValue = isNumeric ? parseFloat(a.cells[columnIndex].innerText) : a.cells[columnIndex].innerText;
              const bValue = isNumeric ? parseFloat(b.cells[columnIndex].innerText) : b.cells[columnIndex].innerText;
              if (currentOrder === 'asc' && currentOrder !== 'none') {
                  return aValue > bValue ? 1 : aValue === bValue ? 0 : -1;
              } else {
                  return aValue > bValue ? -1 : aValue === bValue ? 0 : 1;
              }
              return aValue > bValue ? 1 : aValue === bValue ? 0 : -1;;
          });
          table.tBodies[0].append(...rows);
          col.setAttribute('data-order', newOrder);
      });
  });
  `
const style = `
  body {
      font-size: 14px;
      font-family: Arial, sans-serif;
      color: #6b7280;
  }

  table {
      width: 100%;
      caption-side: bottom;
      font-size: 14px;
      border-collapse: collapse;
  }

  table caption {
      margin-top: 1rem;
      font-size: 14px;
      color: #6b7280;
  }

  table thead tr {
      border-bottom: 1px solid;
  }

  table th {
      height: 48px;
      padding: 0 16px;
      font-weight: 500;
      color: #6b7280;
  }

  table td {
      padding: 16px;
  }

  tr td:not(:first-child) {
    text-align: right;
  }

  table tbody tr {
      border-bottom: 1px solid;
  }

  a {
      text-decoration: none;
  }

  a:hover {
      text-decoration: underline;
  }

  @media (prefers-color-scheme: dark) {
      html {
        background-color: black;
      }
      a, p {
        color: rgb(232, 211, 162);
      }
      a:visited {
        color: rgb(145, 23, 76);
      }
      table, tr, td {
        border: 1px solid rgb(51, 0, 111);
      }
    }
  `
const script = `
  document.querySelectorAll("a").forEach(function(el) {
      el.addEventListener("click", function(ev) {
          if (!ev.repeat) {
              let myidx = 0;
              const row = el.closest("tr");
              let child = el.closest("td");
              while((child = child.previousElementSibling) != null) {
                  myidx++;
              }
              try {
                  row.nextElementSibling.children[myidx].querySelector("p > a").focus();
              } finally {
                  row.parentNode.removeChild(row);
              }
          }
      });
  });
  `
export const scoreCodes: { [key: string]: string } = {
	'0': 'Civil Rights',
	'1': 'Economy',
	'2': 'Political Freedoms',
	'3': 'Population',
	'4': 'Wealth Gaps',
	'5': 'Death Rate',
	'6': 'Compassion',
	'7': 'Eco',
	'8': 'Social Conservatism',
	'9': 'Nudity',
	'10': 'Industry: Automobile Manufacturing',
	'11': 'Industry: Cheese Exports',
	'12': 'Industry: Basket Weaving',
	'13': 'Industry: Informtion Technology',
	'14': 'Industry: Pizza Delivery',
	'15': 'Industry: Trout Fishing',
	'16': 'Industry: Arms Manufacturing',
	'17': 'Sector: Agriculture',
	'18': 'Industry: Beverage Sales',
	'19': 'Industry: Timber Woodchipping',
	'20': 'Industry: Mining',
	'21': 'Industry: Insurance',
	'22': 'Industry: Furniture Restoration',
	'23': 'Industry: Retail',
	'24': 'Industry: Book Publishing',
	'25': 'Industry: Gambling',
	'26': 'Sector: Manufacturing',
	'27': 'Government Size',
	'28': 'Welfare',
	'29': 'Public Healthcare',
	'30': 'Law Enforcement',
	'31': 'Business Subsidization',
	'32': 'Religiousness',
	'33': 'Income Equality',
	'34': 'Niceness',
	'35': 'Rudeness',
	'36': 'Intelligence',
	'37': 'Ignorance',
	'38': 'Political Apathy',
	'39': 'Health',
	'40': 'Cheerfulness',
	'41': 'Weather',
	'42': 'Compliance',
	'43': 'Safety',
	'44': 'Lifespan',
	'45': 'Ideological Radicality',
	'46': 'Defense Forces',
	'47': 'Pacifism',
	'48': 'Economic Freedom',
	'49': 'Taxation',
	'50': 'Freedom From Taxation',
	'51': 'Corruption',
	'52': 'Integrity',
	'53': 'Authoritarianism',
	'54': 'Youth Rebelliousness',
	'55': 'Culture',
	'56': 'Employment',
	'57': 'Public Transport',
	'58': 'Tourism',
	'59': 'Weaponization',
	'60': 'Recreational Drug Use',
	'61': 'Obesity',
	'62': 'Secularism',
	'63': 'Environmental Beauty',
	'64': 'Charmlessness',
	'65': 'Influence',
	'66': 'World Assembly Endorsements',
	'67': 'Averageness',
	'68': 'Human Development Index',
	'69': 'Primitiveness',
	'70': 'Scientific Advancement',
	'71': 'Inclusiveness',
	'72': 'Average Income',
	'73': 'Average Income Of Poor',
	'74': 'Average Income Of Rich',
	'75': 'Public Education',
	'76': 'Economic Output',
	'77': 'Crime',
	'78': 'Foreign Aid',
	'79': 'Black Market',
	'80': 'Residency',
	'81': 'Survivors',
	'82': 'Zombies',
	'83': 'Dead',
	'84': 'Percentage Zombies',
	'85': 'Average Disposable Income',
	'86': 'International Artwork',
	'87': 'Patriotism',
	'88': 'Food Quality',
}
