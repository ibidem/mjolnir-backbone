<?
	namespace app;

	/* @var $theme ThemeView */
	/* @var $lang  Lang */
?>

<div class="mj-Text-Field">

	<% if (options.display == 'standard') { %>
		<input class="mj-Text-Field-field" type="text"/>
		<span class="alert alert-error mj-Text-Field-error app-hidden"></span>
	<% } else if (options.display == 'area') { %>
		<textarea class="mj-Text-Field-field"></textarea>
		<span class="alert alert-error mj-Text-Field-error app-hidden"></span>
	<% } else { %>
		[unrecognized display property <%= options.display %>]
	<% } // endif %>

</div>
