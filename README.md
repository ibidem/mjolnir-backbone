The following files are helpers for building web applications based on the
popular [Backbone](http://backbonejs.org/). The scripts provide some extra
functionality and are generally designed to integrate well with the default
project structure.

To include the files add the following core to the mjolnir theme's script
[nyx](https://github.com/ibidem/nyx.gem).json

	{
		"repo": "https://github.com/ibidem/mjolnir-backbone.git",
		"path": "src/app/extentions/mjolnir",
		"version": "1.0.0",
		"ensure": {
			"dependencies/templates": "../templates/extentions/mjolnir",
			"dependencies/packages": "src/packages",
			"dependencies/widgets": "src/widgets"
		},
		"cleanup": ['dependencies']
	}

## Mjolnir Theme Configuration

**The following are the are what you need to get starting using a standard
mjolnir theme structure as the base.**

Sample scripts configuration:

	<?php namespace app;

		$packages = array
			(
				'packages/jquery',
				'packages/jquery-ui-position',
				'packages/json2',
				'packages/underscore',
				'packages/backbone',
				'packages/supermodel',
				'packages/moment',
				'packages/big',
				'packages/pusher.color',
				'packages/accounting',
	#			'packages/money', // money conversion
			);

		$mjolnir_required_widgets = array
			(
				// Date.Field
					'widgets/pikaday',
			);

		$plugins = Arr::index
			(
				$mjolnir_required_widgets,
				// ...your application plugins...
			);

	return array
		(
			'+app' => Arr::index
				(
					$packages,
					$plugins,
					[
						// extentions: Mjolnir
						'app/extentions/mjolnir/bootstrap',
						// ---Types----------------------------------------
						'app/extentions/mjolnir/Instantiatable',
						'app/extentions/mjolnir/Renderable',
						'app/extentions/mjolnir/Exception',
						// ---Components-----------------------------------
						'app/extentions/mjolnir/backbone/Router',
						'app/extentions/mjolnir/backbone/View',
						'app/extentions/mjolnir/backbone/Model',
						'app/extentions/mjolnir/Auditor',
						'app/extentions/mjolnir/backbone/Collection',
						'app/extentions/mjolnir/Field',
						'app/extentions/mjolnir/Popover',
						'app/extentions/mjolnir/Loader',
						// ---Macros---------------------------------------
						'app/extentions/mjolnir/macros/inlineEditing',
						'app/extentions/mjolnir/macros/newInlineEntry',
						'app/extentions/mjolnir/macros/field/getters',
						'app/extentions/mjolnir/macros/field/placeholders',

						// ---Color----------------------------------------
						'mjolnir-Color-Field'    => 'app/extentions/mjolnir/modules/Color/Field',
						// ---Date-----------------------------------------
						'mjolnir-Date-Field'     => 'app/extentions/mjolnir/modules/Date/Field',
						// ---Text-----------------------------------------
						'mjolnir-Text-Field'     => 'app/extentions/mjolnir/modules/Text/Field',
						// ---Select---------------------------------------
						'mjolnir-Select-Field'   => 'app/extentions/mjolnir/modules/Select/Field',
						// ---Currency-------------------------------------
						'app/extentions/mjolnir/modules/Currency/Model',
						'mjolnir-Currency-Field' => 'app/extentions/mjolnir/modules/Currency/Field',

					// == Application =====================================

						'app/bootstrap',
						'app/etc/routes',
						'app/etc/boot',

						// ...your application modules...

						# example modules

						// ---Tag------------------------------------------
						'app-Tag-Model'      => 'app/modules/Tag/Model',
						'app-Tag-Collection' => 'app/modules/Tag/Collection',
						'app-Tag-Field'      => 'app/modules/Tag/Field',
						'app-Tag-Layout'     => 'app/modules/Tag/Layout',
						// ---Client---------------------------------------
						'app-Client-Model'      => 'app/modules/Client/Model',
						'app-Client-Collection' => 'app/modules/Client/Collection',
						'app-Client-Field'      => 'app/modules/Client/Field',
						'app-Client-Layout'     => 'app/modules/Client/Layout',

						# end example

						// initialize
						'app/main',
					]
				),

			'frontend' => '+app',

		); # config

Sample template loading code:

	<?
		namespace app;

		/* @var $theme ThemeView */
		/* @var $lang  Lang */

		$scriptsconfig = include '+scripts/+scripts'.EXT;

		#
		# The following detects which templates needs to be loaded based on the
		# current script configuration. Single page app assumed; all targets are
		# loaded.
		#

		$templates = [];
		foreach ($scriptsconfig['targeted-mapping'] as $target => $scripts)
		{
			if ( ! \is_string($scripts))
			{
				foreach ($scripts as $key => $script)
				{
					if (\is_string($key))
					{
						if (\preg_match('/app-([A-Z].+)/', $key, $matches))
						{
							$templates[$matches[1]] = 'templates/modules/'.\str_replace('-', '/', $matches[1]);
						}
						else if (\preg_match('/app-(.+)/', $key, $matches))
						{
							$templates[$matches[1]] = 'templates/'.\str_replace('-', '/', $matches[1]);
						}
						else # extention
						{
							$templates[$key] = 'templates/extentions/'.\str_replace('-', '/', $key);
						}
					}
				}
			}
		}

	?>

	<div id="YOURAPP-context">
		<div class="container">
			<div class="main-loading-indicator">
				Loading, please wait... <span class="progress"></span>
			</div>
		</div>
	</div>

	<? foreach ($templates as $template => $path): ?>
		<script type="text/x-underscore-template" id="<?= $template ?>-template">
			<?= $theme->partial($path)->render() ?>
		</script>
	<? endforeach; ?>
