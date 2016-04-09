module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('server/package.json'),
    
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
    }


    
  });

  
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');


  grunt.registerTask('build', [ 
    'clean', 'concat', 'uglify'
  ]);


};
