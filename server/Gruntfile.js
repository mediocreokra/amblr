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
    },

    // plugin that creates a config file based on target which will allow
    // you to specify environment specific variables used on client side
    // I.E. services.js for the endpoint of our API server
    ngconstant: {
      // Options for all targets
      options: {
        space: '  ',
        wrap: '"use strict";\n\n {\%= __ngModule %}',
        name: 'amblr.config',
      },
      // Environment targets
      development: {
        options: {
          dest: '../client/www/js/config.js'
        },
        constants: {
          ENV: {
            name: 'development',
            apiEndpoint: 'http://localhost:3000'
          }
        }
      },
      production: {
        options: {
          dest: '../client/www/js/config.js'
        },
        constants: {
          ENV: {
            name: 'production',
            apiEndpoint: 'http://192.241.235.109:3000'
          }
        }
      }
    },

    watch: {
      scripts: {
        files: [
          ''
        ],
        tasks: [
          'build'
        ]
      },
      css: {
        files: '',
        tasks: ['cssmin']
      }
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
  grunt.loadNpmTasks('grunt-ng-constant');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  grunt.registerTask('server-dev', function(target) {

    grunt.task.run(['ngconstant:development']);

    var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon'
    });

    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);



  });

  grunt.registerTask('server-prod', function(target) {
    grunt.task.run(['ngconstant:production']);
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
      grunt.task.run(['ngconstant:production']);
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
