export const htmlContent = (content: string, style?: string, sortFunction?: string) => {
	return `
    <html>
    <head>
    <style>
    ${
			style
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
    `
		}
    </style>
    </head>
    <body>
    <table>
    ${content}
    ${
			sortFunction
				? ''
				: `
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
		}
    </table>
    <script>
    document.querySelectorAll("td").forEach(function(el) {
      el.addEventListener("click", function() {
        const row = el.parentNode;
        row.nextElementSibling.querySelector("a").focus();
        row.parentNode.removeChild(row);
      });
    });
    ${sortFunction || ''}
    </script>
    </body>
    </html>
    `;
};
