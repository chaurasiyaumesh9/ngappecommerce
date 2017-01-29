'use strict';

module.exports = function( grunt ) {

	var appConfig = {
		app: 'app',
		port: 8010
	};
  grunt.initConfig({
	yeoman: appConfig,
    pkg: grunt.file.readJSON('package.json'),
	concurrent: {
		dev: ["watch"],
		options: {
			logConcurrentOutput: true
		}
	},
	nodemon: {
		dev: {
			script: 'server.js',
			options: {
				/** Environment variables required by the NODE application **/
				watch: ["server"],
				delay: 300,

				callback: function (nodemon) {
					nodemon.on('log', function (event) {
						console.log(event.colour);
					});

					/** Open the application in a new browser window and is optional **/
					nodemon.on('config:update', function () {
						// Delay before server listens on port
						setTimeout(function() {
							require('open')('http://localhost:8010/');
						}, 1000);
					});

					/** Update .rebooted to fire Live-Reload **/
					nodemon.on('restart', function () {
						// Delay before server listens on port
						setTimeout(function() {
							require('fs').writeFileSync('.rebooted', 'rebooted');
						}, 1000);
					});
				}
			}
		}
	},
    watch:{
		//files:["**/*.html"],
		//tasks: ["nodemon"],
		gruntfile: {
			files: ['Gruntfile.js']
		  },
		livereload: {
			options: {
			  livereload: '<%= connect.options.livereload %>'
			},
			files: [
			  '**/*.html'
			]
		}
	},
	 connect: {
	  options: {
		port: appConfig.port ,
		hostname: 'localhost',
		base: "app/frontend",
		livereload: 35729
	  },
	  livereload: {
		options: {
		  open: true
		}
	  }
	}
  });

	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-concurrent");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-nodemon");
  
	//grunt.registerTask("default", ["concurrent:dev"]);
	
	grunt.registerTask('serve', 'Compile then start a connect web server', function ( ) {
		grunt.task.run([
			//"concurrent:dev",
			'connect:livereload',
			'watch'
		]);
	  });

};