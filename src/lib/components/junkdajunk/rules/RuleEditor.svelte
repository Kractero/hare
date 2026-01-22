<script lang="ts">
	import FormCheckbox from '$lib/components/FormCheckbox.svelte'
	import FormInput from '$lib/components/FormInput.svelte'
	import FormSelect from '$lib/components/FormSelect.svelte'
	import FormTextArea from '$lib/components/FormTextArea.svelte'
	import { Button } from '$lib/components/ui/button'
	import { Label } from '$lib/components/ui/label'
	import {
		type Action,
		type ActionType,
		type Attribute,
		type Condition,
		type Operator,
		type Rule,
	} from '$lib/helpers/rules'

	let { rule = $bindable(), onSave, onCancel }: { rule: Rule; onSave: () => void; onCancel: () => void } = $props()

	const attributes: Attribute[] = [
		'Rarity',
		'Season',
		'Market Value',
		'Bid',
		'Region',
		'Flag',
		'Card ID',
		'Owner Count',
	]

	const operators: Record<string, Operator[]> = {
		default: ['=', '!=', '>', '>=', '<', '<='],
		string: ['=', '!=', 'contains', 'does not contain', 'starts with', 'ends with'],
		list: ['in list', 'not in list'],
		select: ['=', '!='],
	}

	function getOperators(attr: Attribute): Operator[] {
		switch (attr) {
			case 'Region':
			case 'Flag':
				return [...operators.string, ...operators.list]
			case 'Rarity':
				return operators.select
			default:
				return [...operators.default, ...operators.list]
		}
	}

	const actionTypes: ActionType[] = ['Gift', 'Junk', 'Sell', 'Nothing']

	function getAvailableActionTypes(currentIndex: number): ActionType[] {
		const otherActions = rule.actions.filter((_, i) => i !== currentIndex).map(a => a.type)
		const hasGift = otherActions.includes('Gift')
		const hasJunk = otherActions.includes('Junk')

		return actionTypes.filter(type => {
			if (type === 'Gift' && hasJunk) return false
			if (type === 'Junk' && hasGift) return false
			return true
		})
	}

	function addCondition() {
		rule.conditions = [...rule.conditions, { id: crypto.randomUUID(), attribute: 'Rarity', operator: '=', value: '' }]
	}

	function removeCondition(index: number) {
		rule.conditions = rule.conditions.filter((_, i) => i !== index)
	}

	function addAction() {
		const available = getAvailableActionTypes(rule.actions.length)
		rule.actions = [...rule.actions, { id: crypto.randomUUID(), type: available[0] || 'Nothing', target: '' }]
	}

	function removeAction(index: number) {
		rule.actions = rule.actions.filter((_, i) => i !== index)
	}

	function isNumericAttribute(attr: Attribute): boolean {
		return ['Season', 'Market Value', 'Bid', 'Card ID', 'Owner Count'].includes(attr)
	}

	// update whenever user changes attribute
	$effect(() => {
		rule.conditions.forEach(condition => {
			const validOps = getOperators(condition.attribute)
			if (!validOps.includes(condition.operator)) {
				condition.operator = validOps[0]
			}
		})
	})
</script>

<div class="flex flex-col gap-6">
	<div class="flex flex-col gap-2">
		<h2 class="text-xl font-bold">Rule Editor</h2>
		<FormInput label="Rule Name (Optional)" bind:bindValue={rule.name} id="rule-name" />
	</div>

	<div class="bg-card text-card-foreground rounded-xl border shadow">
		<div class="flex flex-col space-y-1.5 p-6">
			<h3 class="leading-none font-semibold tracking-tight">Conditions</h3>
			<p class="text-muted-foreground text-sm">If all/any of these match...</p>
		</div>
		<div class="flex flex-col gap-4 p-6 pt-0">
			<div class="mb-2 flex items-center gap-2">
				<span class="text-sm font-medium">Match:</span>
				<select class="rounded border p-1" bind:value={rule.combinator}>
					<option value="AND">ALL (AND)</option>
					<option value="OR">ANY (OR)</option>
				</select>
			</div>

			{#each rule.conditions as condition, i}
				<div class="flex flex-col gap-2 border-b pb-4 last:border-0 last:pb-0 md:flex-row md:items-start">
					<div class="flex-1">
						<Label class="mb-1.5 block text-sm">Attribute</Label>
						<select class="w-full rounded border px-2 py-2 text-sm" bind:value={condition.attribute}>
							{#each attributes as attr}
								<option value={attr}>{attr}</option>
							{/each}
						</select>
					</div>
					<div class="w-full md:w-40">
						<Label class="mb-1.5 block text-sm">Operator</Label>
						<select class="w-full rounded border px-2 py-2 text-sm" bind:value={condition.operator}>
							{#each getOperators(condition.attribute) as op}
								<option value={op}>{op === '!=' ? '≠' : op}</option>
							{/each}
						</select>
					</div>
					<div class="flex-1">
						{#if condition.attribute === 'Rarity'}
							<Label class="mb-1.5 block text-sm">Value</Label>
							<select class="w-full rounded border px-2 py-2 text-sm" bind:value={condition.value}>
								<option value="common">Common</option>
								<option value="uncommon">Uncommon</option>
								<option value="rare">Rare</option>
								<option value="ultra-rare">Ultra-Rare</option>
								<option value="epic">Epic</option>
								<option value="legendary">Legendary</option>
							</select>
						{:else if condition.operator === 'in list' || condition.operator === 'not in list'}
							<FormTextArea
								editor={true}
								label="Values (newline or comma separated)"
								bind:bindValue={condition.value}
								id={`val-${i}`} />
						{:else}
							<FormInput
								editor={true}
								label="Value"
								bind:bindValue={condition.value}
								id={`val-${i}`}
								type={isNumericAttribute(condition.attribute) ? 'number' : 'text'} />
						{/if}
					</div>
					<Button variant="destructive" size="sm" onclick={() => removeCondition(i)}>X</Button>
				</div>
			{/each}
			<Button variant="outline" size="sm" onclick={addCondition} class="self-start">+ Add Condition</Button>
		</div>
	</div>

	<div class="bg-card text-card-foreground rounded-xl border shadow">
		<div class="flex flex-col space-y-1.5 p-6">
			<h3 class="leading-none font-semibold tracking-tight">Actions</h3>
			<p class="text-muted-foreground text-sm">Then do this...</p>
		</div>
		<div class="flex flex-col gap-4 p-6 pt-0">
			{#each rule.actions as action, i}
				<div class="flex flex-col gap-2 border-b pb-4 last:border-0 last:pb-0 md:flex-row md:items-end">
					<div class="w-full md:w-40">
						<Label class="mb-1.5 block text-sm">Action</Label>
						<select class="w-full rounded border px-2 py-2 text-sm" bind:value={action.type}>
							{#each getAvailableActionTypes(i) as type}
								<option value={type}>{type}</option>
							{/each}
						</select>
					</div>
					{#if action.type === 'Gift'}
						<div class="flex-1">
							<FormInput label="Target Nation" bind:bindValue={action.target} id={`target-${i}`} />
						</div>
					{/if}
					<Button variant="destructive" size="sm" onclick={() => removeAction(i)}>X</Button>
				</div>
			{/each}
			<Button variant="outline" size="sm" onclick={addAction} class="self-start">+ Add Action</Button>
		</div>
	</div>

	<div class="flex justify-end gap-2">
		<Button variant="outline" onclick={onCancel}>Cancel</Button>
		<Button onclick={onSave}>Save Rule</Button>
	</div>
</div>
