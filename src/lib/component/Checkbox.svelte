<script lang="ts">
    export let omittedSeasons: string;
    function cbChange(e: Event & { currentTarget: EventTarget & HTMLInputElement; }) {
		if (e.currentTarget.checked) omittedSeasons += e.currentTarget.id
		else omittedSeasons = omittedSeasons.replace(e.currentTarget.id, '')
	}
</script>

<div class="flex flex-col lg:flex-row gap-4 justify-between max-w-lg">
    <p class="w-24">Skip Seasons</p>
    <div class="flex">
        <div class="m-1">
            <label for="1">S1</label>
            <input checked={omittedSeasons.includes('1')} disabled={omittedSeasons.length >= 2 && !omittedSeasons.includes('1')} on:change={cbChange} class="m-1" type="checkbox" id="1" />
        </div>
        <div class="m-1">
            <label for="1">S2</label>
            <input checked={omittedSeasons.includes('2')} disabled={omittedSeasons.length >= 2 && !omittedSeasons.includes('2')} on:change={cbChange} class="m-1" type="checkbox" id="2" />
        </div>
        <div class="m-1">
            <label for="1">S3</label>
            <input checked={omittedSeasons.includes('3')} disabled={omittedSeasons.length >= 2 && !omittedSeasons.includes('3')} on:change={cbChange} class="m-1" type="checkbox" id="3" />
        </div>
    </div>
</div>