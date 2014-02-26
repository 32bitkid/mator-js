module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  
  // Project configuration.
  grunt.initConfig({
    uglify: {
      all: {
        files: {
          'mator-min.js': ['mator.js']
        }
      }
    },
    docco: {
      debug: {
        src: ['mator.js'],
        options: {
          output: 'docs/'
        }
      }
    },
    jshint: {
      all: ["mator.js"]
    }
  });

  grunt.registerTask('default', ['jshint','uglify','docco']);
};