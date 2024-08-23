<script context="module" lang="ts">
	// const tips = [
	// 	"You can change the gamemode by clicking WORDLE+ or swiping the board left or right.",
	// 	"Hard mode is game mode specific. Turning it on in one game mode won't change it on the others.",
	// 	"Double tap or right click a word on the board to learn its definition.",
	// 	"Hard mode can be enabled during a game if you haven't violated the hard mode rules yet.",
	// 	"Double tap or right click the next row to see how many possible words can be played there, if you use all the previous information.",
	// 	"Because words are chosen from the list randomly it is possible to get the same word again.",
	// 	"When you see the refresh button in the top left corner it means a new word is ready.",
	// 	"Everyone has the same wordle at the same time. Your word #73 is the same as everyone elses #73.",
	// 	"There are more valid guesses than possible words, ie. not all 5 letter words can be selected as an answer by the game.",
	// 	"Historical games don't count towards your stats. Historical games are when you follow a link to a specific game number.",
	// 	"Only the data for latest historical game is saved for each game mode.",
	// ];
	const  tips = [
    "Unaweza kubadilisha hali ya mchezo kwa kubonyeza WORDLE+ au kupige boardi kushoto au kulia.",
    "Hali ngumu ni maalum kwa hali ya mchezo. Kuizima kwenye hali moja ya mchezo hakutabadilisha kwenye hali zingine.",
    "Gonga mara mbili au bonyeza kulia kwenye neno kwenye boardi kujua tafsiri yake.",
    "Hali ngumu inaweza kuwezeshwa wakati wa mchezo ikiwa huja kiuka sheria za hali ngumu bado.",
    "Gonga mara mbili au bonyeza kulia kwenye safu inayofuata ili kuona ni maneno mangapi yanaweza kupigwa hapo, ikiwa utatumia maelezo yote ya awali.",
    "Kwa sababu maneno yanachaguliwa kutoka kwenye orodha kwa bahati nasibu, inawezekana kupata neno lile lile tena.",
    "Unapoona kitufe cha upya kwenye kona ya juu kushoto ina maana neno jipya linapatikana.",
    "Kila mtu ana neno sawa la wordle wakati huo huo. Neno lako nambari #73 ni sawa na #73 ya kila mtu mwingine.",
    "Kuna majaribio zaidi halali kuliko maneno yanayowezekana, yaani, si maneno yote ya herufi 5 yanaweza kuchaguliwa kama jibu na mchezo.",
    "Michezo ya kihistoria hailingani na takwimu zako. Michezo ya kihistoria ni pale unapofuatilia kiungo cha nambari maalum ya mchezo.",
    "Takwimu za mchezo wa kihistoria wa hivi karibuni pekee ndizo zinazohifadhiwa kwa kila hali ya mchezo.",
];

</script>

<script lang="ts">
	export let change: boolean;
	let index = Math.floor(tips.length * Math.random());
	$: if (change) index = Math.floor(tips.length * Math.random());

	function nextTip() {
		index = (index + 1) % tips.length;
	}
	function previousTip() {
		index = (index - 1 + tips.length) % tips.length;
	}
</script>

<div class="outer">
	<div class="number">Tip {index + 1}/{tips.length}</div>
	<div class="tip">{tips[index]}</div>
	<svg
		class="left"
		on:click={previousTip}
		on:keydown={previousTip}
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 100 100"
	>
		<path d="M75,0L25,50L75,100z" />
	</svg>
	<svg
		on:click={nextTip}
		on:keypress={nextTip}
		class="right"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 100 100"
	>
		<path d="M25,0L75,50L25,100z" />
	</svg>
</div>

<style lang="scss">
	.outer {
		margin: 15px auto;
		padding: 10px 20px;
		max-width: calc(0.6 * var(--game-width));
		border: solid 1px var(--border-secondary);
		background: var(--bg-secondary);
		border-radius: 4px;
		position: relative;
	}
	.number {
		text-align: center;
		font-weight: bold;
		font-size: 1.2em;
		margin-bottom: 10px;
	}
	.left,
	.right {
		cursor: pointer;
		position: absolute;
		border-radius: 4px;
		background: var(--fg-primary);
		fill: var(--bg-primary);
		height: 45px;
		padding: 10px 0;
		top: 50%;
	}
	.left {
		left: 0;
		transform: translate(-50%, -50%);
	}
	.right {
		right: 0;
		transform: translate(50%, -50%);
	}
	.tip {
		text-align: center;
		min-height: 70px;
	}
</style>
