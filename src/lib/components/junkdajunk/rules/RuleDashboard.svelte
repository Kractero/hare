<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Label } from '$lib/components/ui/label'
	import { getRuleSummary, type Rule } from '$lib/helpers/rules'
	import { GripVertical } from 'lucide-svelte'

	import RuleEditor from './RuleEditor.svelte'

	let { rules = $bindable() }: { rules: Rule[] } = $props()

	let editingRule: Rule | null = $state(null)
	let editingIndex: number = $state(-1)
	let draggedItem: number | null = $state(null)
	let dragOverItem: number | null = $state(null)
	let dropPosition: 'before' | 'after' | null = $state(null)

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
	<div role="button" tabindex="0" class="flex flex-col gap-4" ondragover={e => e.preventDefault()}>
		{#if rules.length === 0}
			<div class="text-muted-foreground rounded-lg border border-dashed p-8 text-center">
				No rules defined. Click "Add Rule" to get started.
			</div>
		{/if}
		{#each rules as rule, i (rule.id)}
			<div class="relative">
				{#if dragOverItem === i && dropPosition === 'before'}
					<div
						class="bg-primary absolute -top-2.5 right-0 left-0 z-10 h-1 rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]">
					</div>
				{/if}

				<div
					class={`bg-card text-card-foreground rounded-xl border shadow transition-all ${!rule.enabled ? 'opacity-50' : ''} ${draggedItem === i ? 'opacity-30' : ''}`}
					draggable={true}
					ondragstart={e => onDragStart(e, i)}
					ondragover={e => onDragOver(e, i)}
					ondragleave={onDragLeave}
					ondrop={e => onDrop(e, i)}
					role="listitem">
					<div class="flex items-center gap-4 p-4">
						<div class="cursor-move text-gray-400 hover:text-gray-600">
							<GripVertical size={20} />
						</div>
						<div class="text-muted-foreground min-w-5 text-center font-mono text-xs">
							{i + 1}
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

				{#if dragOverItem === i && dropPosition === 'after'}
					<div
						class="bg-primary absolute right-0 -bottom-2.5 left-0 z-10 h-1 rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]">
					</div>
				{/if}
			</div>
		{/each}

		<Button onclick={addRule} class="w-full">+ Add New Rule</Button>
	</div>
{/if}
