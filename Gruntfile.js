/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    less: {
        compile: {
            files: { //dest                               //src
                'public/stylesheets/style.css': 'public/stylesheets/style.less',
            }
        }
    },
    watch: {
        scripts: {
            files: ['css/*.less'],
            tasks: ['less']
        }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-less');

  // Default task.
  grunt.registerTask('default', ['less']);

};