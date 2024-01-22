<script lang="ts">
	import { onMount } from "svelte";

  const validHeaders = ["Nation", "Deck Value", "Junk Value", "Bank", "Card Count", "Deck Capacity"]
  const hideableHeaders = [ "Common", "Uncommon", "Rare", "Ultra-Rare", "Epic", "Legendary", "S1", "S2", "S3",
    "S1 Common", "S1 Uncommon", "S1 Rare", "S1 Ultra-Rare", "S1 Epic", "S1 Legendary",
    "S2 Common", "S2 Uncommon", "S2 Rare", "S2 Ultra-Rare", "S2 Epic", "S2 Legendary",
    "S3 Common", "S3 Uncommon", "S3 Rare", "S3 Ultra-Rare", "S3 Epic", "S3 Legendary",
  ]
  let ledgerTable: HTMLTableElement;
  let ledger: any;
  let body;
  let displayDate: string;
  async function fillTable(date: string | undefined = "") {
      let fetchDate: Date | string | undefined = date;
      if (!fetchDate) {
        fetchDate = new Date();
        fetchDate.setDate(fetchDate.getDate());
        fetchDate = fetchDate.toISOString().slice(0, 10);
        displayDate = fetchDate;
      }
      const filePath = `https://raw.githubusercontent.com/Kractero/ledger/main/data/${fetchDate}.json`;
      const data = await fetch(filePath);
      if (data.status === 404) {
        const previousDate = new Date();
        previousDate.setDate(previousDate.getDate() - 1);
        displayDate = fetchDate;
        await fillTable(previousDate.toISOString().slice(0, 10)); // Wait for the recursive call to complete
        return;
      }
      ledger = await data.json();
    }
  onMount(() => {
    fillTable()
    const sortableColumns = ledgerTable.querySelectorAll(".sort");
    sortableColumns.forEach((col) => {
        col.addEventListener("click", () => {
          const columnIndex = Array.from((col.parentNode! as any).cells).indexOf(col);
          const rows = Array.from(ledgerTable!.rows).slice(1);
          const currentOrder = col.getAttribute("data-order");
          const newOrder = currentOrder === "asc" ? "desc" : "asc";
          rows.sort((a, b) => {
            const aValue = parseFloat(a.cells[columnIndex].innerText);
            const bValue = parseFloat(b.cells[columnIndex].innerText);
            if (currentOrder === "asc") {
              return aValue > bValue ? 1 : aValue === bValue ? 0 : -1;
            } else {
              return aValue > bValue ? -1 : aValue === bValue ? 0 : 1;
            }
          });
          ledgerTable!.append(...rows);
          col.setAttribute("data-order", newOrder);
        });
      });
  })

</script>

<head>
  <title>Gold Ledger</title> -->
</head>
  <form>
    <input value="" id="date" placeholder="YYYY-MM-DD" />
    <button type="submit">Search Old Data</button>
  </form>
  <div class="flex flex-col justify-center">
    <h2>{displayDate}</h2>
    <button
      class="m-auto w-max mt-0 mb-4 p-2 bg-[#0ea539] rounded-lg border-none"
      on:click={() => {
        ledgerTable.querySelectorAll(".hideable").forEach((el) => el.classList.toggle("hidden"))
      }}>
        Toggle Additional Headers
    </button>
    <table bind:this={ledgerTable} class="caption-bottom text-sm text-right border-collapse">
      <tr class="border-b border-black">
        <th>#</th>
        {#each validHeaders as header}
          <th class='sort h-12 p-4 font-medium sort' data-order='none'>{header}</th>
        {/each}
        {#each hideableHeaders as header}
          <th class='sort h-12 p-4 font-medium hideable hidden sort' data-order='none'>{header}</th>
        {/each}
      </tr>
      {#if ledger}
        <tbody bind:this={body}>
          {#each ledger as deck}
          <tr class="border-b border-black">
            <td></td>
            {#each validHeaders as header}
              <td class="p-4">{deck[header]}</td>
            {/each}
            {#each hideableHeaders as header}
              <td class="hideable hidden">
                {#if deck[header]}<a
                  target='_blank'
                  href={`https://www.nationstates.net/nation=${deck.Nation}/page=deck/?filter=${header.toLowerCase()}`}
                >
                  {deck[header]}
                </a>
                {/if}
              </td>
            {/each}
          </tr>
        {/each}
        </tbody>
      {/if}
    </table>
  </div>

<style>
  table {
    counter-reset: serial-number
  }

  table td:first-child:before {
    counter-increment: serial-number;
    content: counter(serial-number);
  }
</style>