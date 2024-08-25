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

export async function nsIterator(puppets: string, mode: string, main?: string) {
	const puppetsList = puppets.split('\n')
	const baseURL = `https://${localStorage.getItem('connectionUrl') || 'www'}.nationstates.net`

	const buildTableRow = (index: number, nation: string, path: string, script: string) => `
        <tr>
            <td><p>${index + 1} of ${puppetsList.length}</p></td>
            <td><p><a target="_blank" href="${baseURL}/${path}/User_agent=${main}/Script=${script}/Generated_by=${script}/Author_discord=scrambleds/Author_main_nation=Kractero/${path.includes('create_nation') ? `nation=${nation}` : ''}">Link to Nation</a></p></td>
        </tr>`

	const generateContainerRules = () => {
		const nationRules = puppetsList
			.map(nation => `@^.*\\.nationstates\\.net/(.*/)?nation=${nation}(/.*)?$ , ${nation}`)
			.join('\n')
		const containerRules = puppetsList
			.map(nation => `@^.*\\.nationstates\\.net/(.*/)?container=${nation}(/.*)?$ , ${nation}`)
			.join('\n')
		return [nationRules, containerRules]
	}

	switch (mode) {
		case 'Containerise':
			return generateContainerRules()

		case 'Login Sheet':
			return puppetsList
				.map((nation, i) =>
					buildTableRow(
						i,
						nation,
						`container=${nation}/nation=${nation}/page=upload_flag/test=1`,
						'Login_Sheet'
					)
				)
				.join('\n')

		case 'Creator':
			return puppetsList
				.map((nation, i) =>
					buildTableRow(
						i,
						nation,
						`container=${nation}/nation=${nation}/page=create_nation`,
						'Creator'
					)
				)
				.join('\n')

		default:
			return ''
	}
}

export const htmlContent = (content: string, name: string) => {
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
      ${
				name !== 'Gold Retriever'
					? `
        <tr>
          <td>
            <p>
              <a target="_blank" href="https://this-page-intentionally-left-blank.org/">Done!</a>
            </p>
          </td>
          <td>
            <p>
              <a target="_blank" href="https://this-page-intentionally-left-blank.org/">Done!</a>
            </p>
          </td>
        </tr>
      `
					: ''
			}
      </table>
      <script>
      ${
				name === 'RCES'
					? script
					: `
      document.querySelectorAll("td").forEach(function(el) {
        el.addEventListener("click", function() {
          const row = el.parentNode;
          row.nextElementSibling.querySelector("a").focus();
          row.parentNode.removeChild(row);
        });
      });
     `
			}
      ${name === 'Gold Retriever' ? sort : ''}
      </script>
      </body>
      </html>
      `
}

let sort = `
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
let style = `
  body {
      font-size: 14px;
      font-family: Arial, sans-serif;
      color: #6b7280;
  }

  table {
      width: 100%;
      caption-side: bottom;
      font-size: 14px;
      text-align: left;
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
let script = `
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

export function timeAgo(date: string) {
	const now = new Date()
	const createdDate = new Date(date)

	const yearsDiff = now.getFullYear() - createdDate.getFullYear()
	const monthsDiff = now.getMonth() - createdDate.getMonth()
	const daysDiff = now.getDate() - createdDate.getDate()

	let years = yearsDiff
	let months = monthsDiff
	let days = daysDiff

	if (days < 0) {
		months -= 1
		days += new Date(now.getFullYear(), now.getMonth(), 0).getDate()
	}
	if (months < 0) {
		years -= 1
		months += 12
	}

	const yearsStr = years > 0 ? `${years} year${years > 1 ? 's' : ''} ` : ''
	const monthsStr = months > 0 ? `${months} month${months > 1 ? 's' : ''} ` : ''
	const daysStr = days > 0 ? `${days} day${days > 1 ? 's' : ''} ` : ''

	return `${yearsStr}${monthsStr}${years < 1 && months < 1 ? daysStr : ''} ago`.trim()
}

export const urlParameters = (tool: string, main: string) => {
	return `?generated_by=Hare${tool}__author_main_nation_Kractero__usedBy_${main}`
}
