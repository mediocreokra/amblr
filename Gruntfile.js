module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('client/package.json'),
    
    clean: ['client/dist'],

    concat: {
      options: {
        separator: ';\n',
      },
      js: {
        src: ['client/www/js/*.js'],
        dest: 'client/dist/<%= pkg.name %>.js',
      },
      css: {
        src: ['client/www/css/*.css'],
        dest: 'client/dist/<%= pkg.name %>.css',
      } 
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'client/dist/<%= pkg.name %>.min.js': ['client/dist/<%= pkg.name %>.js']
        }
      }
    },
    
    eslint: {
      target: [
        'Gruntfile.js',
        'client/tests/*.js',
        'client/www/tests/*.js',
        'client/www/js/*.js',
        'client/www/js/**/*.js',
        'server/config/*.js',
        'server/controllers/*.js',
        'server/models/*.js',
        'server/server.js'
      ]
    },
    
    cssmin: {
      options: {
        keepSpecialComments: 0
      },
      dist: {
        files: {
          'client/dist/<%= pkg.name %>.min.css': 'client/dist/<%= pkg.name %>.css'
        }
      }
    },
    
  });
  
  // Because we have two 'node_modules' folders (one in server/ and one in client/), 
  // we must use grunt.loadTasks instead of grunt.loadNpmTasks
  
  grunt.loadTasks('server/node_modules/grunt-contrib-concat/tasks');
  grunt.loadTasks('server/node_modules/grunt-contrib-clean/tasks');
  grunt.loadTasks('server/node_modules/grunt-contrib-uglify/tasks');
  grunt.loadTasks('server/node_modules/grunt-contrib-cssmin/tasks');
  grunt.loadTasks('server/node_modules/grunt-nodemon/tasks');
  grunt.loadTasks('server/node_modules/grunt-eslint/tasks');

  grunt.registerTask('server-dev', function(target) {
    var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.piepe(process.stderr);
    grunt.task.run(['watch']);
  });
  

  grunt.registerTask('build', [ 
    'clean', 'concat', 'uglify', 'cssmin', 'test'
  ]);

  grunt.registerTask('test', [ 
    'eslint'
  ]);

};

