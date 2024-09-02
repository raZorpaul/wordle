<script lang="ts">
	import { COLS, ROWS } from "../../utils";

	import { Tile } from "../board";
	export let visible: boolean;
</script>

<h3>Jinsi ya kucheza</h3>
<div>Bahatisha <strong>NENO</strong> katika majaribio ya {ROWS}.</div>
<div>Kila  neno  ulio bahatisha lazima iwe neno halali la herufi {COLS}. Bonyeza  Return  ili kuwasilisha.</div>
<div>
Baada ya kila bahati, rangi ya vigae itabadilika ili kuonyesha jinsi nadhani yako ilikuwa karibu na
	neno.
</div>
<div class:complete={visible} class="examples">
	<div><strong>Mifano</strong></div>
	<div class="row">
		<Tile value="n" state="🟩" />
		<Tile value="y" state="🔳" />
		<Tile value="o" state="🔳" />
		<Tile value="t" state="🔳" />
		<Tile value="a" state="🔳" />
	</div>
	<div>Herufi  <strong>N</strong> iko katika neno na mahali pazuri.</div>
	<div class="row">
		<Tile value="m" state="🔳" />
		<Tile value="a" state="🟨" />
		<Tile value="m" state="🔳" />
		<Tile value="b" state="🔳" />
		<Tile value="o" state="🔳" />
	</div>
	<div>Herufi<strong>I</strong> iko kwenye neno lakini iko mahali pabaya.</div>
	<div class="row">
		<Tile value="p" state="🔳" />
		<Tile value="e" state="🔳" />
		<Tile value="n" state="🔳" />
		<Tile value="d" state="⬛" />
		<Tile value="o" state="🔳" />
	</div>
	<div>Herufi  <strong>d</strong> haiku kwenye neno</div>
</div>
<div>
<!-- Hii ni burudani ya asili <a
		href="https://www.nytimes.com/games/wordle/"
		lengo="_tupu"
		rel="noreferrer">Neno</a
	>
	na Josh Wardle na hali na vipengele vya ziada, vinavyokuruhusu kucheza maneno yasiyo na kikomo. Badili
	kwa hali isiyo na kikomo ya kucheza idadi isiyo na kikomo ya nyakati.
	<br /><br /> -->
	Fungua menyu ya mipangilio ili kuona baadhi ya vipengele vya ziada.
	<br />
	Imeandikwa na Svelte, katika Typescript na
	<a href="https://github.com/raZorpaul" target="_blank" rel="noreferrer">Joshua</a>.
</div>

<style lang="scss">
	div {
		margin: 14px 0;
	}
	.examples {
		border-top: 1px solid var(--border-primary);
		border-bottom: 1px solid var(--border-primary);
		:global(.row > *) {
			height: 100%;
			aspect-ratio: 1;
		}
		&:not(.complete) :global(.row .back) {
			transition-delay: 0.3s;
		}
	}
	.row {
		height: 40px;
		display: flex;
		gap: 4px;
	}
</style>
