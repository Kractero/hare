<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Label } from '$lib/components/ui/label'
	import { getRuleSummary, type Rule } from '$lib/helpers/rules'

	import RuleEditor from './RuleEditor.svelte'

	let { rules = $bindable() }: { rules: Rule[] } = $props()

	let editingRule: Rule | null = $state(null)
	let editingIndex: number = $state(-1)

	function createNewRule(): Rule {
		return {
			id: crypto.randomUUID(),
			enabled: true,
			name: '',
			conditions: [],
			combinator: 'AND',
			actions: [],
		}
	}

	function addRule() {
		editingRule = createNewRule()
		editingIndex = -1
	}

	function editRule(index: number) {
		editingRule = JSON.parse(JSON.stringify(rules[index]))
		editingIndex = index
	}

	function saveRule() {
		if (editingRule) {
			if (editingIndex === -1) {
				rules = [...rules, editingRule]
			} else {
				rules[editingIndex] = editingRule
			}
			editingRule = null
			editingIndex = -1
		}
	}

	function deleteRule(index: number) {
		rules = rules.filter((_, i) => i !== index)
	}

	function moveRule(index: number, direction: 'up' | 'down') {
		if (direction === 'up' && index > 0) {
			const temp = rules[index]
			rules[index] = rules[index - 1]
			rules[index - 1] = temp
		} else if (direction === 'down' && index < rules.length - 1) {
			const temp = rules[index]
			rules[index] = rules[index + 1]
			rules[index + 1] = temp
		}
	}

	function toggleRule(index: number) {
		rules[index].enabled = !rules[index].enabled
	}

	function cloneRule(index: number) {
		const original = rules[index]
		const clone = JSON.parse(JSON.stringify(original))
		clone.id = crypto.randomUUID()
		clone.name = original.name ? `${original.name} (Copy)` : ''
		// Insert copy after the original
		rules.splice(index + 1, 0, clone)
		rules = rules
	}

	function onDragStart(e: DragEvent, index: number) {
		draggedItem = index
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move'
		}
	}

	function onDragOver(e: DragEvent, index: number) {
		e.preventDefault()
		dragOverItem = index

		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
		const midpoint = rect.top + rect.height / 2
		dropPosition = e.clientY < midpoint ? 'before' : 'after'
	}

	function onDragLeave() {
		dragOverItem = null
		dropPosition = null
	}

	function onDrop(e: DragEvent, index: number) {
		e.preventDefault()
		if (draggedItem === null) return

		let targetIndex = index
		if (dropPosition === 'after') {
			targetIndex = index + 1
		}

		// If dragging an item to its own position or right after itself, do nothing
		if (draggedItem === index || (dropPosition === 'after' && draggedItem === index + 1)) {
			draggedItem = null
			dragOverItem = null
			dropPosition = null
			return
		}

		const newRules = [...rules]
		const [removed] = newRules.splice(draggedItem, 1)

		let actualInsertIndex = targetIndex
		if (draggedItem < targetIndex) {
			actualInsertIndex--
		}

		newRules.splice(actualInsertIndex, 0, removed)
		rules = newRules

		draggedItem = null
		dragOverItem = null
		dropPosition = null
	}
</script>

{#if editingRule}
	<RuleEditor
		bind:rule={editingRule}
		onSave={saveRule}
		onCancel={() => {
			editingRule = null
			editingIndex = -1
		}} />
{:else}
	<div class="flex flex-col gap-4">
		{#if rules.length === 0}
			<div class="text-muted-foreground rounded-lg border border-dashed p-8 text-center">
				No rules defined. Click "Add Rule" to get started.
			</div>
		{/if}
		{#each rules as rule, i}
			<div class={`bg-card text-card-foreground rounded-xl border shadow ${!rule.enabled ? 'opacity-50' : ''}`}>
				<div class="flex items-center gap-4 p-4">
					<div class="flex flex-col items-center gap-1">
						<Button variant="ghost" size="sm" class="h-6 w-6 p-0" onclick={() => moveRule(i, 'up')} disabled={i === 0}>
							▲
						</Button>
						<span class="text-muted-foreground text-xs">{i + 1}</span>
						<Button
							variant="ghost"
							size="sm"
							class="h-6 w-6 p-0"
							onclick={() => moveRule(i, 'down')}
							disabled={i === rules.length - 1}>
							▼
						</Button>
					</div>

					<div class="flex-1">
						<div class="flex items-center gap-2 font-medium">
							<span>{getRuleSummary(rule)}</span>
						</div>
						<div class="text-muted-foreground text-sm">
							{rule.actions.map(a => `${a.type} ${a.target ? `to ${a.target}` : ''}`).join(', ')}
						</div>
					</div>

					<div class="flex items-center gap-2">
						<Button variant={rule.enabled ? 'default' : 'secondary'} size="sm" onclick={() => toggleRule(i)}>
							{rule.enabled ? 'On' : 'Off'}
						</Button>
						<Button variant="secondary" size="sm" onclick={() => cloneRule(i)}>Clone</Button>
						<Button variant="outline" size="sm" onclick={() => editRule(i)}>Edit</Button>
						<Button variant="destructive" size="sm" onclick={() => deleteRule(i)}>Delete</Button>
					</div>
				</div>
			</div>
		{/each}

		<Button onclick={addRule} class="w-full">+ Add New Rule</Button>
	</div>
{/if}
