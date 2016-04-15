module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('../client/package.json'),
    
    clean: ['../client/dist'],

    concat: {
      options: {
        separator: ';\n',
      },
      js: {
        src: ['../client/www/js/*.js'],
        dest: '../client/dist/<%= pkg.name %>.js',
      },
      css: {
        src: ['../client/www/css/*.css'],
        dest: '../client/dist/<%= pkg.name %>.css',
      } 
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          '../client/dist/<%= pkg.name %>.min.js': ['../client/dist/<%= pkg.name %>.js']
        }
      }
    },
    
    eslint: {
      target: [
        'Gruntfile.js',
        '../client/www/js/*.js',
        '../client/www/js/**/*.js',
        'config/*.js',
        'controllers/*.js',
        'models/*.js',
        'server.js'
      ]
    },
    
    cssmin: {
      options: {
        keepSpecialComments: 0
      },
      dist: {
        files: {
          '../client/dist/<%= pkg.name %>.min.css': '../client/dist/<%= pkg.name %>.css'
        }
      }
    },
    
    env: {
      prod: {
        NODE_ENV: 'production',
        DEST: 'temp'
      },
      dev: {
        NODE_ENV: 'development',
        DEST: 'temp'
      }
    },
    
    shell: {
      prodServer: {
        command: 'git push origin master', // this should eventually be 'git push live production'
        options: {                         // once the deployment process is confirmed 
          stdout: true,
          stderr: true,
          failOnError: true
        }
      }
    },
    simplemocha: {
      options: {
        globals: ['expect'],
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'tap'
      },
      all: { src: ['test/*.js'] }
    }
    
  });
  

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-shell');
  
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
  
  grunt.registerTask('test', [ 
    'eslint', 'simplemocha'
  ]);

  grunt.registerTask('build', [ 
    'clean', 'concat', 'uglify', 'cssmin', 'test'
  ]);
  
  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      grunt.task.run(['env:prod']);
      grunt.task.run(['shell:prodServer']);
    } else {
      grunt.task.run(['env:dev']);
      grunt.task.run([ 'server-dev' ]);
    }
  });
  
  grunt.registerTask('deploy', [
    'test', 'build', 'upload'
  ]);

  grunt.registerTask('dev_env', [
    'env:dev'
  ]);

};