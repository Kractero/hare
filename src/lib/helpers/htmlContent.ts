import { script, sort, style } from '$lib/helpers/sortFunctionString';

export const htmlContent = (content: string, name: string) => {
  return `
    <html>
    <head>
    <style>
    ${name === "Gold Retriever"
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
    ${name !== "Gold Retriever" && `
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
    ${name === "RCES" ? script : `
    document.querySelectorAll("td").forEach(function(el) {
      el.addEventListener("click", function() {
        const row = el.parentNode;
        row.nextElementSibling.querySelector("a").focus();
        row.parentNode.removeChild(row);
      });
    });
   `
    }
    ${name === "Gold Retriever" ? sort : ''}
    </script>
    </body>
    </html>
    `;
};
