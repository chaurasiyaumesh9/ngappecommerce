
module.exports = function( grunt ){
	var yeomanConfig = {
		app: 'app'
	};
	var path = require('path');
	
	grunt.initConfig({
		yeoman: yeomanConfig,
		watch:{
			files: ["**/*.html"]
		},
		express: {
			options: {
				port: 8010,
				hostname: 'localhost'
			},
			livereload: {
				options: {
					livereload: true,
					serverreload: true,
					bases: [ 'app/frontend']
				}
			}
		},
		open: {
			server: {
				url: 'http://localhost:<%= express.options.port %>'
			}
		}
	});
	
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks('grunt-express');
	grunt.loadNpmTasks('grunt-open');
	
	
	grunt.registerTask('default', ['express:livereload','open','watch'] );

}

