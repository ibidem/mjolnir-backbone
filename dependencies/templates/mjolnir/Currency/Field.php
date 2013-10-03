<?
	namespace app;

	/* @var $theme ThemeView */
	/* @var $lang  Lang */
?>

<div class="mj-Currency-Field">

	<div class="app-text-nowrap">
		<span class="mj-Currency-Field-value field-value">
			<i class="muted">Free</i>
		</span>
		<% if (options.context !== 'transparent') { %>
			&nbsp;
			<button class="mj-Currency-Field-toggle field-toggle btn">
				<i class="icon-gears"></i>
			</button>
		<% } %>
	</div>

	<div class="mj-Currency-Field-popup popover">

		<div class="popover-title">
			<i class="mj-Currency-Field-close icon-remove pull-right"></i>
			<b>Change Value</b>
		</div>

		<div class="popover-content">
			<div class="pane">
				<div class="mj-Currency-Field-input">
					<!-- js content -->
				</div>

				<div class="mj-Currency-Field-type">
					<!-- js content -->
				</div>
			</div>
		</div>

		<div class="popover-footer">

			<hr/>
			<span class="mj-Currency-Field-deselect">
				<i class="icon-trash"></i> Clear Value
			</span>

		</div>

	</div>

</div>
